import { Add } from "@mui/icons-material";
import { Box, Grid, TextField, FormHelperText } from "@mui/material";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNotification } from "../../AppContextProvider";
import { api } from "../../../lib/api";
import { parseError } from "../../../lib/parseError";
import { LoadingButton } from "@mui/lab";
import { memo } from "react";
const CreateInviteCode = memo(function CreateInviteCode() {
    const [, setNotification] = useNotification();
    const [code, setCode] = useState("");
    const [description, setDescription] = useState("");
    const createFormRef = useRef<HTMLFormElement>(null);
    const [createLoading, setCreateLoading] = useState(false);

    const { t } = useTranslation();

    const createSubmit = useCallback(
        (e?: React.FormEvent<HTMLFormElement>) => {
            e?.preventDefault();
            if (code && code.length === 10) {
                setCreateLoading(true);
                api.serverInviteCodesCreate({ code, description })
                    .then(() => {
                        setCreateLoading(false);
                        setNotification({
                            open: true,
                            severity: "success",
                            text: t("dashboard.invite_codes.create.success_notification"),
                        });
                        setCode("");
                        setDescription("");
                    })
                    .catch((err) => {
                        setCreateLoading(false);
                        setNotification({
                            open: true,
                            severity: "error",
                            text: parseError(err),
                        });
                    });
            }
        },
        [code, description, setNotification, t]
    );

    return (
        <Box onSubmit={createSubmit} component="form" ref={createFormRef}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField
                        color="secondary"
                        required
                        label={t("dashboard.invite_codes.create.code_label")}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        inputProps={{ minLength: 10, maxLength: 10 }}
                        fullWidth
                        error={code.length !== 0 && code.length !== 10}
                    />
                    <FormHelperText error={code.length !== 0 && code.length !== 10}>
                        {t("dashboard.invite_codes.create.code_helper_text")}
                    </FormHelperText>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        color="secondary"
                        label={t("dashboard.invite_codes.create.description_label")}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                    />
                </Grid>
            </Grid>
            <LoadingButton
                color="secondary"
                startIcon={<Add />}
                type="submit"
                loading={createLoading}
                loadingPosition="start"
                disabled={!createFormRef.current?.checkValidity?.() || createLoading}
                variant="contained"
                className="!mt-2"
            >
                {t("dashboard.invite_codes.create.create_button")}
            </LoadingButton>
        </Box>
    );
});
export default CreateInviteCode;
