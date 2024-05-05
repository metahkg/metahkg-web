import { Delete } from "@mui/icons-material";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
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

    const deleteSubmit = () => {
        if (selectedCode) {
            setDeleteLoading(true);
            api.serverInviteCodesDelete(selectedCode)
                .then(() => {
                    setDeleteLoading(false);
                    setNotification({
                        open: true,
                        severity: "success",
                        text: "Invite code deleted successfully.",
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
    };

    return (
        <Box>
            <Box>
                <FormControl sx={{ minWidth: 250 }}>
                    <InputLabel color="secondary">Select Invite Code</InputLabel>
                    <Select
                        value={selectedCode}
                        onChange={(e) => setSelectedCode(e.target.value)}
                        label="Select Invite Code"
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
                Delete
            </LoadingButton>
        </Box>
    );
});
export default DeleteInviteCode;
