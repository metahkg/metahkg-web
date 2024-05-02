import { Add } from "@mui/icons-material";
import { Box, Grid, TextField, FormHelperText } from "@mui/material";
import { useRef, useState } from "react";
import { useNotification } from "../../AppContextProvider";
import { api } from "../../../lib/api";
import { parseError } from "../../../lib/parseError";
import { LoadingButton } from "@mui/lab";

export default function CreateInviteCode() {
    const [, setNotification] = useNotification();
    const [code, setCode] = useState("");
    const [description, setDescription] = useState("");
    const createFormRef = useRef<HTMLFormElement>(null);
    const [createLoading, setCreateLoading] = useState(false);

    const createSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        if (code && code.length === 10) {
            setCreateLoading(true);
            api.serverInviteCodesCreate({ code, description })
                .then(() => {
                    setCreateLoading(false);
                    setNotification({
                        open: true,
                        severity: "success",
                        text: "Invite code created  successfully.",
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
    };

    return (
        <Box onSubmit={createSubmit} component="form" ref={createFormRef}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField
                        color="secondary"
                        required
                        label="Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        inputProps={{ minLength: 10, maxLength: 10 }}
                        fullWidth
                        error={code.length !== 0 && code.length !== 10}
                    />
                    <FormHelperText error={code.length !== 0 && code.length !== 10}>
                        Code must be 10 digits long.
                    </FormHelperText>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        color="secondary"
                        label="Description (optional)"
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
                Create
            </LoadingButton>
        </Box>
    );
}
