import { Delete } from "@mui/icons-material";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNotification } from "../../AppContextProvider";
import { api } from "../../../lib/api";
import { parseError } from "../../../lib/parseError";
import { Invite } from "@metahkg/api";
import { LoadingButton } from "@mui/lab";
import { memo } from "react";
const DeleteInviteCode = memo(function DeleteInviteCode() {
    const [, setNotification] = useNotification();
    const [codes, setCodes] = useState<Invite[]>([]);
    const [selectedCode, setSelectedCode] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { t } = useTranslation();

    useEffect(() => {
        api.serverInviteCodes()
            .then(setCodes)
            .catch((err) => {
                setNotification({
                    open: true,
                    severity: "error",
                    text: parseError(err),
                });
            });
    }, [setNotification]);

    const deleteSubmit = useCallback(() => {
        if (selectedCode) {
            setDeleteLoading(true);
            api.serverInviteCodesDelete(selectedCode)
                .then(() => {
                    setDeleteLoading(false);
                    setNotification({
                        open: true,
                        severity: "success",
                        text: t("dashboard.invite_codes.delete.success_notification"),
                    });
                    setSelectedCode("");
                    // Update the list of codes
                    api.serverInviteCodes()
                        .then(setCodes)
                        .catch(() => {});
                })
                .catch((err) => {
                    setDeleteLoading(false);
                    setNotification({
                        open: true,
                        severity: "error",
                        text: parseError(err),
                    });
                });
        }
    }, [selectedCode, setNotification, t]);

    return (
        <Box>
            <Box>
                <FormControl sx={{ minWidth: 250 }}>
                    <InputLabel color="secondary">
                        {t("dashboard.invite_codes.delete.select_label")}
                    </InputLabel>
                    <Select
                        value={selectedCode}
                        onChange={(e) => setSelectedCode(e.target.value)}
                        label={t("dashboard.invite_codes.delete.select_label")}
                        color="secondary"
                    >
                        {codes.map((code) => (
                            <MenuItem key={code.code} value={code.code}>
                                {code.code}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <LoadingButton
                color="error"
                startIcon={<Delete />}
                onClick={deleteSubmit}
                loading={deleteLoading}
                loadingPosition="start"
                disabled={!selectedCode || deleteLoading}
                variant="contained"
                className="!mt-2"
            >
                {t("dashboard.invite_codes.delete.delete_button")}
            </LoadingButton>
        </Box>
    );
});
export default DeleteInviteCode;
