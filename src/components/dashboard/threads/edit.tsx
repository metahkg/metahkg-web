import {
    Box,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    SelectChangeEvent,
    MenuItem,
} from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNotification, useCategories } from "../../AppContextProvider";
import { useTranslation } from "react-i18next";
import { api } from "../../../lib/api";
import { Edit } from "@mui/icons-material";
import { Thread } from "@metahkg/api";
import { parseError } from "../../../lib/parseError";
import { LoadingButton } from "@mui/lab";
import Loader from "../../../lib/loader";
import { memo } from "react";
const EditThread = memo(function EditThread() {
    const formRef = useRef<HTMLFormElement>(null);
    const [, setNotification] = useNotification();
    const [threadId, setThreadId] = useState<number | "">("");
    const [thread, setThread] = useState<Thread | null>(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reason, setReason] = useState("");
    const [categories] = useCategories();
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
            if (thread) {
                setSubmitLoading(true);
                api.threadEdit(thread.id, {
                    category: thread?.category || undefined,
                    title: thread?.title || undefined,
                    reason,
                })
                    .then(() => {
                        setSubmitLoading(false);
                        setNotification({
                            open: true,
                            severity: "success",
                            text: t("dashboard.threads.edit.success_notification"),
                        });
                    })
                    .catch((err) => {
                        setSubmitLoading(false);
                        setNotification({
                            open: true,
                            severity: "error",
                            text: parseError(err),
                        });
                    });
            }
        },
        [thread, reason, setNotification, t]
    );

    const fetchThread = (id: number) => {
        setLoading(true);
        api.thread(id)
            .then((res) => {
                setThread(res);
                setLoading(false);
            })
            .catch((err) => {
                setThread(null);
                setNotification({
                    open: true,
                    severity: "error",
                    text: parseError(err),
                });
                setLoading(false);
            });
    };

    return (
        <Box component="form" ref={formRef} onSubmit={submit} className="m-2">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        value={threadId}
                        onChange={(e) => {
                            setThreadId(Number(e.target.value));
                            if (e.target.value) fetchThread(Number(e.target.value));
                        }}
                        label={t("dashboard.threads.edit.thread_id_label")}
                        color="secondary"
                        type="number"
                        inputProps={{
                            min: 1,
                        }}
                    />
                </Grid>
                {loading && <Loader position="center" />}
                {!loading && !!(threadId && thread) && (
                    <React.Fragment>
                        <Grid item xs={6}>
                            <TextField
                                color="secondary"
                                required
                                label={t("dashboard.threads.edit.new_title_label")}
                                onChange={(e) => {
                                    setThread({ ...thread, title: e.target.value });
                                }}
                                inputProps={{ maxLength: 150 }}
                                fullWidth
                                value={thread.title}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl required sx={{ minWidth: 250 }} fullWidth>
                                <InputLabel color="secondary">
                                    {t("dashboard.threads.edit.new_category_label")}
                                </InputLabel>
                                <Select
                                    value={thread.category}
                                    onChange={(e: SelectChangeEvent<number | "">) => {
                                        setThread({
                                            ...thread,
                                            category: e.target.value as number,
                                        });
                                    }}
                                    label={t("dashboard.threads.edit.new_category_label")}
                                    color="secondary"
                                    required
                                    fullWidth
                                >
                                    {categories.map((cat) => (
                                        <MenuItem value={cat.id}>{cat.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid xs={12} item>
                            <TextField
                                color="secondary"
                                variant="outlined"
                                label={t("dashboard.threads.edit.reason_label")}
                                placeholder={t(
                                    "dashboard.threads.edit.reason_placeholder"
                                )}
                                required
                                onChange={(e) => {
                                    setReason(e.target.value);
                                }}
                                value={reason || ""}
                            />
                        </Grid>
                    </React.Fragment>
                )}
                {!loading && !!(threadId && thread) && (
                    <LoadingButton
                        color="secondary"
                        startIcon={<Edit />}
                        type="submit"
                        loading={submitLoading}
                        loadingPosition="start"
                        disabled={!valid || submitLoading}
                        variant="contained"
                        className="!mt-4 !ml-4"
                    >
                        {t("dashboard.threads.edit.edit_button")}
                    </LoadingButton>
                )}
            </Grid>
        </Box>
    );
});
export default EditThread;
