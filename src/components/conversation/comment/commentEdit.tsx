/*
 Copyright (C) 2022-present Wong Chun Yat (wcyat)

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
import { Box, TextField } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import TextEditor from "../../textEditor";
import { useCallback, useState } from "react";
import { api } from "../../../lib/api";
import { useThreadId } from "../ConversationContext";
import { useNotification } from "../../AppContextProvider";
import { parseError } from "../../../lib/parseError";
import { LoadingButton } from "@mui/lab";
import { HTMLComment } from "@metahkg/api";
import { useTranslation } from "react-i18next";
import { memo } from "react";
const CommentEdit = memo(function CommentEdit() {
    const threadId = useThreadId();
    const [comment, setComment] = useComment();
    const [, setEditing] = useEditing();
    const [edited, setEdited] = useState(
        comment.comment.type === "html" ? comment.comment.html : ""
    );
    const [reason, setReason] = useState("");
    const [, setNotification] = useNotification();
    const [saving, setSaving] = useState(false);
    const { t } = useTranslation();

    const onSave = useCallback(async () => {
        setSaving(true);
        await api
            .commentEdit(threadId, comment.id, {
                html: edited,
                reason,
            })
            .then(() => {
                setComment({
                    ...comment,
                    comment: { ...(comment.comment as HTMLComment), html: edited },
                });
                setEditing(false);
                setReason("");
                setNotification({
                    open: true,
                    severity: "success",
                    text: t("commentEdit.comment_edited"),
                });
            })
            .catch((err) => {
                setNotification({
                    open: true,
                    severity: "error",
                    text: t("commentEdit.unable_to_save_comment", {
                        error: parseError(err),
                    }),
                });
            });
        setSaving(false);
    }, [comment, edited, reason, setComment, setEditing, setNotification, threadId, t]);

    if (comment.comment.type !== "html") {
        return <></>;
    }

    return (
        <Box className="my-2">
            <TextEditor
                initText={comment.comment.html}
                onChange={setEdited}
                toolbarBottom
                noMenuBar
                noStatusBar
                lengthLimit={50000}
                autoResize
                noAutoSave
            />
            <Box className="my-2 flex justify-between items-center">
                <TextField
                    className="!mr-5"
                    color="secondary"
                    variant="outlined"
                    fullWidth
                    required
                    label={t("commentEdit.reason_label")}
                    onChange={(e) => {
                        setReason(e.target.value);
                    }}
                />
                <LoadingButton
                    variant="contained"
                    onClick={onSave}
                    disabled={comment.comment.html === edited || !reason}
                    color="secondary"
                    loading={saving}
                    startIcon={<EditIcon />}
                    loadingPosition="start"
                >
                    {t("commentEdit.save_button")}
                </LoadingButton>
            </Box>
        </Box>
    );
});
export default CommentEdit;
