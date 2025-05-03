import { Refresh } from "@mui/icons-material";
import { Box, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useCallback, useRef, useState } from "react";
import { useNotification } from "../../AppContextProvider";
import { api } from "../../../lib/api";
import { parseError } from "../../../lib/parseError";
import { LoadingButton } from "@mui/lab";
import { memo } from "react";
const GenerateInviteCode = memo(function GenerateInviteCode() {
    const [, setNotification] = useNotification();
    const [description, setDescription] = useState("");
    const generateFormRef = useRef<HTMLFormElement>(null);
    const [generateLoading, setGenerateLoading] = useState(false);
    const [generatedCode, setGeneratedCode] = useState<string | null>(null);

    const { t } = useTranslation();

    const generateSubmit = useCallback(
        (e?: React.FormEvent<HTMLFormElement>) => {
            e?.preventDefault();
            setGenerateLoading(true);
            api.serverInviteCodesGenerate({ description })
                .then((res) => {
                    setGenerateLoading(false);
                    setGeneratedCode(res.code);
                    setNotification({
                        open: true,
                        severity: "success",
                        text: t("dashboard.invite_codes.generate.success_notification"),
                    });
                })
                .catch((err) => {
                    setGenerateLoading(false);
                    setNotification({
                        open: true,
                        severity: "error",
                        text: parseError(err),
                    });
                });
        },
        [description, setNotification, t]
    );

    return (
        <Box onSubmit={generateSubmit} component="form" ref={generateFormRef}>
            <TextField
                color="secondary"
                label={t("dashboard.invite_codes.generate.description_label")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
            />

            <LoadingButton
                color="secondary"
                startIcon={<Refresh />}
                type="submit"
                loading={generateLoading}
                loadingPosition="start"
                disabled={generateLoading}
                variant="contained"
                className="!mt-2"
            >
                {t("dashboard.invite_codes.generate.generate_button")}
            </LoadingButton>
            {generatedCode && (
                <Typography variant="body2" color="text.secondary" className="!mt-2">
                    {t("dashboard.invite_codes.generate.generated_code_label")}
                    {generatedCode}
                </Typography>
            )}
        </Box>
    );
});
export default GenerateInviteCode;
