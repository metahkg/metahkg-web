import React, { useState } from "react";
import { Close, Comment as CommentIcon } from "@mui/icons-material";
import { Box, Button, DialogTitle, IconButton, Snackbar } from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";
import { api } from "../lib/api";
import Comment from "./conversation/comment";
import {
    useCRoot,
    useEditor,
    useThread,
    useThreadId,
} from "./conversation/ConversationContext";
import { useUpdate } from "./conversation/functions/update";
import TextEditor from "./texteditor";
import { useIsSmallScreen, useNotification } from "./ContextProvider";

export default function FloatingEditor() {
    const threadId = useThreadId();
    const [editor, setEditor] = useEditor();
    const handleClose = () => {
        setEditor({ ...editor, open: false });
    };
    const [comment, setComment] = useState("");
    const [rtoken, setRtoken] = useState<null | string>(null);
    const [sending, setSending] = useState(false);
    const [fold, setFold] = useState(false);
    const [, setNotification] = useNotification();
    const [thread] = useThread();
    const isSmallScreen = useIsSmallScreen();
    const update = useUpdate();
    const croot = useCRoot();
    function sendComment() {
        setSending(true);
        api.post("/posts/comment", {
            id: threadId,
            comment,
            quote: editor.quote?.id,
            rtoken,
        })
            .then(() => {
                setEditor({ ...editor, open: false });
                update();
                if (croot.current) {
                    const newscrollTop =
                        croot.current?.scrollHeight - croot.current?.clientHeight;
                    croot.current.scrollTop = newscrollTop;
                }
                setSending(false);
            })
            .catch((err) => {
                setNotification({ open: true, text: err.response.data.error });
                setSending(false);
            });
    }
    return (
        <Snackbar
            sx={{ zIndex: 1000, top: `${thread?.pin ? "110" : "60"}px !important` }}
            className="border-radius-20"
            anchorOrigin={{ horizontal: "right", vertical: "top" }}
            open={editor.open}
        >
            <Box
                sx={{
                    maxWidth: isSmallScreen ? "100vw" : "70vw",
                    width: isSmallScreen ? "100vw" : "50vw",
                    maxHeight: "70vh",
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
                {editor.quote && <Comment comment={editor.quote} fold noId />}
                {!fold && (
                    <Box className="border-radius-20">
                        <TextEditor
                            onChange={(e) => {
                                setComment(e);
                            }}
                            autoresize
                            className="ml10 mr10"
                        />
                        <Box
                            className={`${
                                isSmallScreen ? "" : "flex"
                            } justify-space-between align-center m10`}
                        >
                            <ReCAPTCHA
                                theme="dark"
                                sitekey={
                                    process.env.REACT_APP_recaptchasitekey ||
                                    "6LcX4bceAAAAAIoJGHRxojepKDqqVLdH9_JxHQJ-"
                                }
                                onChange={(token) => {
                                    setRtoken(token || "");
                                }}
                            />
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={sendComment}
                                disabled={!rtoken || !comment || sending}
                                className={isSmallScreen ? "mt10" : ""}
                            >
                                <CommentIcon />
                                Comment
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </Snackbar>
    );
}
