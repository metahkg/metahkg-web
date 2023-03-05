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
import { Box, DialogTitle, IconButton, Snackbar, Typography } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import CAPTCHA from "@metahkg/react-captcha";
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
    useDarkMode,
    useIsSmallScreen,
    useNotification,
    useReCaptchaSiteKey,
    useServerConfig,
    useTurnstileSiteKey,
} from "./AppContextProvider";
import useChangePage from "../hooks/conversation/changePage";
import { roundup } from "../lib/common";
import { parseError } from "../lib/parseError";
import ReCaptchaNotice from "../lib/reCaptchaNotice";
import { clearTinymceDraft } from "../lib/clearTinymceDraft";
import { LoadingButton } from "@mui/lab";

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
    const darkMode = useDarkMode();
    const [shouldUpdate, setShouldUpdate] = useState(false);
    const [newCommentId, setNewCommentId] = useState(0);
    const captchaRef = useRef<CAPTCHA>(null);
    const reCaptchaSiteKey = useReCaptchaSiteKey();
    const turnstileSiteKey = useTurnstileSiteKey();
    const [serverConfig] = useServerConfig();

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
        if (serverConfig?.captcha === "turnstile") {
            setCreating(true);
        }
        const captchaToken = await captchaRef.current?.executeAsync();
        if (!captchaToken) {
            setCreating(false);
            return;
        }
        setCreating(true);
        api.commentCreate(threadId, {
            comment,
            quote: editor.quote?.id,
            captchaToken,
        })
            .then((data) => {
                setNewCommentId(data.id);

                const numOfPages = roundup((data.id || 0) / 25);

                setEditor({ ...editor, open: false });
                clearTinymceDraft(window.location.pathname);

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
                captchaRef.current?.reset();
            });
    }

    return (
        <Snackbar
            className={`rounded-2xl !z-[1000] ${
                isSmallScreen ? "!right-2 !left-2" : ""
            }  ${thread?.pin ? "!top-[110px]" : "!top-[60px]"}`}
            anchorOrigin={{ horizontal: "right", vertical: "top" }}
            open={editor.open}
            key={editor?.quote?.id || editor.edit || 0}
        >
            <Box
                sx={{
                    bgcolor: "primary.dark",
                }}
                className={`rounded-2xl shadow overflow-auto ${
                    isSmallScreen
                        ? "!max-w-[calc(100vw-16px)] w-[calc(100vw-16px)] max-h-50v"
                        : "max-w-70v w-50v max-h-70v"
                }`}
            >
                <DialogTitle className="flex justify-between items-center !p-0">
                    <Typography variant="h5" className="!ml-5 !my-2">
                        {editor.quote ? "Reply" : "Comment"}
                    </Typography>
                    <Box className="flex mr-1">
                        <IconButton
                            className="!my-0 !mr-2 cursor-pointer"
                            onClick={() => {
                                setFold(!fold);
                            }}
                        >
                            {fold ? <ExpandMore /> : <ExpandLess />}
                        </IconButton>
                        <IconButton onClick={handleClose}>
                            <Close className="!text-lg" />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <Box
                    component="form"
                    className={`mx-2 rounded-5 flex flex-col justify-center ${
                        fold ? "hidden" : ""
                    }`}
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
                            className="!mb-2 !mx-1 [&>div]:rounded-lg"
                            maxHeight={200}
                        />
                    )}
                    <TextEditor
                        onChange={(e) => {
                            setComment(e);
                        }}
                        initText={
                            editor.edit &&
                            /*html*/ `<blockquote style="color: #aca9a9; border-left: 2px solid ${
                                darkMode ? "#646262" : "e7e7e7"
                            }; margin-left: 0"><div style="margin-left: 15px">${
                                editor.edit
                            }</div></blockquote><p></p>`
                        }
                        autoResize
                        noMenuBar
                        noStatusBar
                        toolbarBottom
                        lengthLimit={50000}
                        className="max-w-full"
                    />
                    <Box className="my-2 ml-1">
                        <CAPTCHA
                            theme="dark"
                            sitekey={
                                serverConfig?.captcha === "turnstile"
                                    ? turnstileSiteKey
                                    : reCaptchaSiteKey
                            }
                            size="invisible"
                            ref={captchaRef}
                            useTurnstile={serverConfig?.captcha === "turnstile"}
                        />
                        <LoadingButton
                            variant="contained"
                            color="secondary"
                            type="submit"
                            loading={creating}
                            loadingPosition="start"
                            disabled={!comment || creating}
                            startIcon={<CommentIcon />}
                        >
                            Comment
                        </LoadingButton>
                        <ReCaptchaNotice />
                    </Box>
                </Box>
            </Box>
        </Snackbar>
    );
}
