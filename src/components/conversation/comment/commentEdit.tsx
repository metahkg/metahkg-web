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

import { useComment, useEditing } from "../comment";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import TextEditor from "../../textEditor";
import { useState } from "react";
import { api } from "../../../lib/api";
import { useThreadId } from "../ConversationContext";
import { useNotification } from "../../AppContextProvider";
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
                lengthLimit={50000}
                autoResize
                noAutoSave
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
