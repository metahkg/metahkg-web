import { useComment, useEditing } from "../comment";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import TextEditor from "../../textEditor";
import { useState } from "react";
import { api } from "../../../lib/api";
import { useThreadId } from "../ConversationContext";
import { useNotification } from "../../ContextProvider";
import { parseError } from "../../../lib/parseError";

export default function CommentEdit() {
    const threadId = useThreadId();
    const [comment, setComment] = useComment();
    const [, setEditing] = useEditing();
    const [edited, setEdited] = useState(comment.comment);
    const [reason, setReason] = useState("");
    const [, setNotification] = useNotification();
    const [saving, setSaving] = useState(false);

    const onSave = async () => {
        setSaving(true);
        await api
            .commentEdit(threadId, comment.id, {
                comment: edited,
                reason,
            })
            .then(() => {
                setComment({ ...comment, comment: edited });
                setEditing(false);
                setReason("");
                setNotification({
                    open: true,
                    severity: "success",
                    text: "Comment edited.",
                });
            })
            .catch((err) => {
                setNotification({
                    open: true,
                    severity: "error",
                    text: `Unable to save comment: ${parseError(err)}}`,
                });
            });
        setSaving(false);
    };

    return (
        <Box className="my-[10px]">
            <TextEditor
                initText={comment.comment}
                onChange={setEdited}
                toolbarBottom
                noMenuBar
                noStatusBar
                autoResize
            />
            <Box className="my-[10px] flex justify-between items-center">
                <TextField
                    className="!mr-[20px]"
                    color="secondary"
                    variant="outlined"
                    fullWidth
                    required
                    label="Reason"
                    onChange={(e) => {
                        setReason(e.target.value);
                    }}
                />
                {saving ? (
                    <CircularProgress color="secondary" disableShrink />
                ) : (
                    <Button
                        variant="contained"
                        onClick={onSave}
                        disabled={comment.comment === edited || !reason}
                        color="secondary"
                    >
                        <EditIcon className="!mr-[5px]" />
                        Save
                    </Button>
                )}
            </Box>
        </Box>
    );
}
