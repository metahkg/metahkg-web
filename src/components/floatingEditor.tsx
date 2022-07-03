import React, { useEffect, useState } from "react";
import { Close, Comment as CommentIcon } from "@mui/icons-material";
import {
    Box,
    Button,
    CircularProgress,
    DialogTitle,
    IconButton,
    Snackbar,
} from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";
import { api } from "../lib/api";
import Comment from "./conversation/comment";
import {
    useEditor,
    useFinalPage,
    useThread,
    useThreadId,
} from "./conversation/ConversationContext";
import { useUpdate } from "./conversation/functions/update";
import TextEditor from "./textEditor";
import {
    useIsSmallScreen,
    useNotification,
    useReCaptchaSiteKey,
} from "./ContextProvider";
import useChangePage from "./conversation/functions/changePage";
import { roundup } from "../lib/common";
import { parseError } from "../lib/parseError";

declare const grecaptcha: { reset: () => void };

export default function FloatingEditor() {
    const threadId = useThreadId();
    const [editor, setEditor] = useEditor();
    const [comment, setComment] = useState("");
    const [rtoken, setRtoken] = useState<string>("");
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
        setRtoken("");
        setCreating(false);
        setFold(false);
    }

    const handleClose = () => {
        setEditor({ ...editor, open: false });
        clearState();
    };

    function CreateComment() {
        setCreating(true);
        api.threads.comments
            .add({
                threadId,
                comment,
                quote: editor.quote?.id,
                rtoken,
            })
            .then((res: { data: { id: number } }) => {
                setNewCommentId(res.data.id);

                const numOfPages = roundup((res.data.id || 0) / 25);

                setEditor({ ...editor, open: false });

                if (numOfPages !== finalPage)
                    changePage(numOfPages, () => {
                        setShouldUpdate(true);
                    });
                else update({ scrollToComment: res.data.id });

                setCreating(false);
                clearState();
            })
            .catch((err) => {
                setNotification({
                    open: true,
                    text: parseError(err),
                });
                setCreating(false);
                grecaptcha.reset();
            });
    }

    return (
        <Snackbar
            sx={{ zIndex: 1000, top: `${thread?.pin ? "110" : "60"}px !important` }}
            className="border-radius-20"
            anchorOrigin={{ horizontal: "right", vertical: "top" }}
            open={editor.open}
            key={editor?.quote?.id || editor.edit || 0}
        >
            <Box
                sx={{
                    maxWidth: isSmallScreen ? "100vw" : "70vw",
                    width: isSmallScreen ? "100vw" : "50vw",
                    maxHeight: isSmallScreen ? "50vh" : "70vh",
                    bgcolor: "primary.dark",
                    overflow: "auto",
                }}
                className="border-radius-15"
            >
                <DialogTitle className="flex justify-space-between align-center nopadding">
                    <p className="ml20 mt10 mb10">{editor.quote ? "Reply" : "Comment"}</p>
                    <Box className="flex">
                        <p
                            className="novmargin pointer mr10 metahkg-yellow"
                            onClick={() => {
                                setFold(!fold);
                            }}
                        >
                            {fold ? "Expand" : "Fold"}
                        </p>
                        <IconButton className="mr5" onClick={handleClose}>
                            <Close className="font-size-18-force" />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <Box
                    className={`border-radius-20 flex flex-dir-column ${
                        fold ? "display-none" : ""
                    }`}
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
                            className="mb10 ml10 mr10"
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
                        autoresize
                        noMenuBar
                        noStatusBar
                        toolbarBottom
                        className="ml10 mr10"
                    />
                    <Box
                        className={`${
                            isSmallScreen ? "" : "flex"
                        } justify-space-between align-center m10`}
                    >
                        <ReCAPTCHA
                            theme="dark"
                            sitekey={reCaptchaSiteKey}
                            onChange={(token) => {
                                setRtoken(token || "");
                            }}
                        />
                        {creating ? (
                            <CircularProgress
                                color="secondary"
                                className={isSmallScreen ? "mt10" : ""}
                                disableShrink
                            />
                        ) : (
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={CreateComment}
                                disabled={!rtoken || !comment}
                                className={isSmallScreen ? "mt10" : ""}
                            >
                                <CommentIcon className="mr5" />
                                Comment
                            </Button>
                        )}
                    </Box>
                </Box>
            </Box>
        </Snackbar>
    );
}
