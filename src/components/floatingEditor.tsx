import { Close } from "@mui/icons-material";
import { Box, DialogTitle, IconButton, Snackbar } from "@mui/material";
import React, { Dispatch, SetStateAction, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { api } from "../lib/api";
import { commentType } from "../types/conversation/comment";
import Comment from "./conversation/comment";
import { useCRoot } from "./conversation/ConversationContext";
import { useUpdate } from "./conversation/functions/update";
import TextEditor from "./texteditor";

export default function FloatingEditor(props: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    threadId: number;
    quote?: commentType;
}) {
    const { threadId, open, setOpen, quote } = props;
    const handleClose = () => {
        setOpen(false);
    };
    const [comment, setComment] = useState("");
    const [rtoken, setRtoken] = useState<null | string>(null);
    const update = useUpdate();
    const croot = useCRoot();
    function sendComment() {
        api.post("/posts/comment", {
            id: threadId,
            comment,
            quote: quote?.id,
            rtoken,
        }).then(() => {
            update();
            const newscrollTop =
                croot.current?.scrollHeight || 0 - (croot.current?.clientHeight || 0);
            if (croot.current) croot.current.scrollTop = newscrollTop;
        });
    }
    return (
        <Snackbar
            sx={{ bgcolor: "primary.main" }}
            anchorOrigin={{ horizontal: "right", vertical: "top" }}
            open={open}
        >
            <React.Fragment>
                <DialogTitle className="flex justify-space-between align-center">
                    <p className="ml20 novmargin">{quote ? "Reply" : "Comment"}</p>
                    <IconButton className="mr5" onClick={handleClose}>
                        <Close className="font-size-18-force" />
                    </IconButton>
                </DialogTitle>
                {quote && <Comment comment={quote} fold noId />}
                <TextEditor
                    onChange={(e) => {
                        setComment(e);
                    }}
                />
                <Box className="flex">
                    <ReCAPTCHA
                        theme="dark"
                        sitekey={
                            process.env.REACT_APP_recaptchasitekey ||
                            "6LcX4bceAAAAAIoJGHRxojepKDqqVLdH9_JxHQJ-"
                        }
                        onChange={(e) => {
                            setRtoken(e);
                        }}
                    />
                </Box>
            </React.Fragment>
        </Snackbar>
    );
}
