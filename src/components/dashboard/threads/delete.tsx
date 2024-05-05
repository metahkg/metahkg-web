import { Box, Grid, TextField } from "@mui/material";
import { useRef, useState, useEffect } from "react";
import { useNotification } from "../../AppContextProvider";
import { LoadingButton } from "@mui/lab";
import { Delete } from "@mui/icons-material";
import { api } from "../../../lib/api";
import { parseError } from "../../../lib/parseError";
import { memo } from "react";
const DeleteThread = memo(function DeleteThread() {
    const formRef = useRef<HTMLFormElement>();
    const [, setNotification] = useNotification();
    const [threadId, setThreadId] = useState<number | "">("");
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [valid, setValid] = useState(formRef.current?.checkValidity?.());

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (valid !== formRef.current?.checkValidity?.()) {
            setValid(formRef.current?.checkValidity?.());
        }
    });

    const submit = (e?: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        if (threadId && reason) {
            setLoading(true);
            api.threadDelete(threadId, { reason })
                .then(() => {
                    setLoading(false);
                    setNotification({
                        open: true,
                        severity: "success",
                        text: "Thread deleted successfully.",
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
    };

    return (
        <Box component="form" ref={formRef} onSubmit={submit} className="m-2">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        value={threadId}
                        onChange={(e) => {
                            setThreadId(Number(e.target.value));
                        }}
                        label="Thread ID"
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
                            label="Reason for deleting"
                            placeholder="Provide a reason for deleting"
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
                        Delete
                    </LoadingButton>
                )}
            </Grid>
        </Box>
    );
});
export default DeleteThread;
