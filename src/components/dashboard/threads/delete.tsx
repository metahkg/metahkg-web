import { Box, Grid, TextField } from "@mui/material";
import { useRef, useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNotification } from "../../AppContextProvider";
import { LoadingButton } from "@mui/lab";
import { Delete } from "@mui/icons-material";
import { api } from "../../../lib/api";
import { parseError } from "../../../lib/parseError";
import { memo } from "react";
const DeleteThread = memo(function DeleteThread() {
    const formRef = useRef<HTMLFormElement>(null);
    const [, setNotification] = useNotification();
    const [threadId, setThreadId] = useState<number | "">("");
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [valid, setValid] = useState(formRef.current?.checkValidity?.());

    const { t } = useTranslation();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (valid !== formRef.current?.checkValidity?.()) {
            setValid(formRef.current?.checkValidity?.());
        }
    });

    const submit = useCallback(
        (e?: React.FormEvent<HTMLFormElement>) => {
            e?.preventDefault();
            if (threadId && reason) {
                setLoading(true);
                api.threadDelete(threadId, { reason })
                    .then(() => {
                        setLoading(false);
                        setNotification({
                            open: true,
                            severity: "success",
                            text: t("dashboard.threads.delete.success_notification"),
                        });
                    })
                    .catch((err) => {
                        setLoading(false);
                        setNotification({
                            open: true,
                            severity: "error",
                            text: parseError(err),
                        });
                    });
            }
        },
        [reason, setNotification, threadId, t]
    );

    return (
        <Box component="form" ref={formRef} onSubmit={submit} className="m-2">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        value={threadId}
                        onChange={(e) => {
                            setThreadId(Number(e.target.value));
                        }}
                        label={t("dashboard.threads.delete.thread_id_label")}
                        color="secondary"
                        type="number"
                        inputProps={{
                            min: 1,
                        }}
                        required
                    />
                </Grid>
                {threadId && (
                    <Grid item xs={12}>
                        <TextField
                            color="secondary"
                            variant="outlined"
                            label={t("dashboard.threads.delete.reason_label")}
                            placeholder={t("dashboard.threads.delete.reason_placeholder")}
                            required
                            onChange={(e) => {
                                setReason(e.target.value);
                            }}
                            value={reason || ""}
                        />
                    </Grid>
                )}
                {threadId && (
                    <LoadingButton
                        color="error"
                        startIcon={<Delete />}
                        type="submit"
                        loading={loading}
                        loadingPosition="start"
                        disabled={!valid || loading}
                        variant="contained"
                        className="!mt-4 !ml-4"
                    >
                        {t("dashboard.threads.delete.delete_button")}
                    </LoadingButton>
                )}
            </Grid>
        </Box>
    );
});
export default DeleteThread;
