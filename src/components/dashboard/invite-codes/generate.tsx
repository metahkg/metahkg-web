import { Refresh } from "@mui/icons-material";
import { Box, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { useNotification } from "../../AppContextProvider";
import { api } from "../../../lib/api";
import { parseError } from "../../../lib/parseError";
import { LoadingButton } from "@mui/lab";

export default function GenerateInviteCode() {
    const [, setNotification] = useNotification();
    const [description, setDescription] = useState("");
    const generateFormRef = useRef<HTMLFormElement>(null);
    const [generateLoading, setGenerateLoading] = useState(false);
    const [generatedCode, setGeneratedCode] = useState<string | null>(null);

    const generateSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        setGenerateLoading(true);
        api.serverInviteCodesGenerate({ description })
            .then((res) => {
                setGenerateLoading(false);
                setGeneratedCode(res.code);
                setNotification({
                    open: true,
                    severity: "success",
                    text: "Invite code generated  successfully.",
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
    };

    return (
        <Box onSubmit={generateSubmit} component="form" ref={generateFormRef}>
            <TextField
                color="secondary"
                label="Description (optional)"
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
                Generate
            </LoadingButton>
            {generatedCode && (
                <Typography variant="body2" color="text.secondary" className="!mt-2">
                    Generated Code: {generatedCode}
                </Typography>
            )}
        </Box>
    );
}
