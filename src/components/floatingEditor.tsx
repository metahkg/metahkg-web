/*
 Copyright (C) 2022-present Metahkg Contributors

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React, { useEffect, useRef, useState } from "react";
import { Close, Comment as CommentIcon } from "@mui/icons-material";
import {
    Box,
    Button,
    CircularProgress,
    DialogTitle,
    IconButton,
    Snackbar,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import ReCAPTCHA from "react-google-recaptcha";
import { api } from "../lib/api";
import Comment from "./conversation/comment";
import {
    useEditor,
    useFinalPage,
    useThread,
    useThreadId,
} from "./conversation/ConversationContext";
import { useUpdate } from "../hooks/conversation/update";
import TextEditor from "./textEditor";
import {
    useIsSmallScreen,
    useNotification,
    useReCaptchaSiteKey,
} from "./AppContextProvider";
import useChangePage from "../hooks/conversation/changePage";
import { roundup } from "../lib/common";
import { parseError } from "../lib/parseError";
import ReCaptchaNotice from "../lib/reCaptchaNotice";

export default function FloatingEditor() {
    const threadId = useThreadId();
    const [editor, setEditor] = useEditor();
    const [comment, setComment] = useState("");
    const [creating, setCreating] = useState(false);
    const [fold, setFold] = useState(false);
    const [, setNotification] = useNotification();
    const [thread] = useThread();
    const isSmallScreen = useIsSmallScreen();
    const update = useUpdate();
    const changePage = useChangePage();
    const [finalPage] = useFinalPage();
    const [shouldUpdate, setShouldUpdate] = useState(false);
    const [newCommentId, setNewCommentId] = useState(0);
    const reCaptchaRef = useRef<ReCAPTCHA>(null);
    const reCaptchaSiteKey = useReCaptchaSiteKey();

    useEffect(() => {
        if (shouldUpdate && newCommentId) {
            setShouldUpdate(false);
            setNewCommentId(0);
            update({ scrollToComment: newCommentId });
        }
    }, [newCommentId, shouldUpdate, update]);

    function clearState() {
        setComment("");
        setCreating(false);
        setFold(false);
    }

    const handleClose = () => {
        setEditor({ ...editor, open: false });
        clearState();
    };

    async function onSubmit(e?: React.FormEvent<HTMLFormElement>) {
        e?.preventDefault();
        const rtoken = await reCaptchaRef.current?.executeAsync();
        if (!rtoken) return;
        setCreating(true);
        api.commentCreate(threadId, {
            comment,
            quote: editor.quote?.id,
            rtoken,
        })
            .then((data) => {
                setNewCommentId(data.id);

                const numOfPages = roundup((data.id || 0) / 25);

                setEditor({ ...editor, open: false });

                if (numOfPages !== finalPage)
                    changePage(numOfPages, () => {
                        setShouldUpdate(true);
                    });
                else update({ scrollToComment: data.id });

                setCreating(false);
                clearState();
            })
            .catch((err) => {
                setNotification({
                    open: true,
                    severity: "error",
                    text: parseError(err),
                });
                setCreating(false);
                reCaptchaRef.current?.reset();
            });
    }

    return (
        <Snackbar
            className={`rounded-[20px] !z-[1000] ${
                isSmallScreen ? "!right-[8px] !left-[8px]" : ""
            }  ${thread?.pin ? "!top-[110px]" : "!top-[60px]"}`}
            anchorOrigin={{ horizontal: "right", vertical: "top" }}
            open={editor.open}
            key={editor?.quote?.id || editor.edit || 0}
        >
            <Box
                sx={{
                    bgcolor: "primary.dark",
                }}
                className={`rounded-[15px] overflow-auto ${
                    isSmallScreen
                        ? "!max-w-[calc(100vw-16px)] w-[calc(100vw-16px)] max-h-50v"
                        : "max-w-70v w-50v max-h-70v"
                }`}
            >
                <DialogTitle className="flex justify-between items-center !p-0">
                    <p className="!ml-[20px] !mt-[10px] !mb-[10px]">
                        {editor.quote ? "Reply" : "Comment"}
                    </p>
                    <Box className="flex">
                        <IconButton
                            className="!my-0 cursor-pointer !mr-[10px] metahkg-yellow"
                            onClick={() => {
                                setFold(!fold);
                            }}
                        >
                            {fold ? <ExpandMore /> : <ExpandLess />}
                        </IconButton>
                        <IconButton className="!mr-[5px]" onClick={handleClose}>
                            <Close className="!text-[18px]" />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <Box
                    component="form"
                    className={`rounded-[20px] flex flex-col ${fold ? "hidden" : ""}`}
                    onSubmit={onSubmit}
                >
                    {editor.quote && (
                        <Comment
                            comment={editor.quote}
                            fold
                            noId
                            fetchComment
                            noStory
                            noQuote
                            noFullWidth
                            className="!mb-[10px] !ml-[10px] !mr-[10px]"
                            sx={{ "& > div": { borderRadius: 2 } }}
                            maxHeight={200}
                        />
                    )}
                    <TextEditor
                        onChange={(e) => {
                            setComment(e);
                        }}
                        initText={
                            editor.edit &&
                            /*html*/ `<blockquote style="color: #aca9a9; border-left: 2px solid #646262; margin-left: 0"><div style="margin-left: 15px">${editor.edit}</div></blockquote><p></p>`
                        }
                        autoResize
                        noMenuBar
                        noStatusBar
                        toolbarBottom
                        className="!mx-[10px] max-w-[calc(100%-20px)]"
                    />
                    <Box className="m-[10px]">
                        <ReCAPTCHA
                            theme="dark"
                            sitekey={reCaptchaSiteKey}
                            size="invisible"
                            ref={reCaptchaRef}
                        />
                        {creating ? (
                            <CircularProgress
                                color="secondary"
                                disableShrink
                                className="my-[5px]"
                            />
                        ) : (
                            <Button
                                variant="contained"
                                color="secondary"
                                type="submit"
                                disabled={!comment}
                            >
                                <CommentIcon className="!mr-[5px]" />
                                Comment
                            </Button>
                        )}
                        <ReCaptchaNotice
                            className={creating ? "my-0" : "mt-[10px] mb-0"}
                        />
                    </Box>
                </Box>
            </Box>
        </Snackbar>
    );
}
