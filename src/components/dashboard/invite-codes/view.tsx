import React, { useEffect, useState, useCallback } from "react";
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Typography,
    CardActions,
    IconButton,
    Button,
    Grid,
} from "@mui/material";
import { Delete, Sync } from "@mui/icons-material";
import { useIsSmallScreen, useNotification, useUser } from "../../AppContextProvider";
import { api } from "../../../lib/api";
import { parseError } from "../../../lib/parseError";
import { Invite } from "@metahkg/api";
import { memo } from "react";
const ViewInviteCodes = memo(function ViewInviteCodes() {
    const [, setNotification] = useNotification();
    const [codes, setCodes] = useState<Invite[]>([]);
    const isSmallScreen = useIsSmallScreen();
    const [user] = useUser();

    const fetchCodes = useCallback(() => {
        if (user?.role === "admin")
            api.serverInviteCodes()
                .then(setCodes)
                .catch((err) => {
                    setNotification({
                        open: true,
                        severity: "error",
                        text: parseError(err),
                    });
                });
    }, [setNotification, user?.role]);

    useEffect(() => {
        fetchCodes();
        const interval = setInterval(() => {
            fetchCodes();
        }, 5000);
        return () => {
            clearInterval(interval);
        };
    }, [fetchCodes]);

    const handleDelete = useCallback(
        (code: string) => {
            api.serverInviteCodesDelete(code)
                .then(() => {
                    setNotification({
                        open: true,
                        severity: "success",
                        text: "Invite code deleted successfully.",
                    });
                    fetchCodes(); // Update the list  after deletion
                })
                .catch((err) => {
                    setNotification({
                        open: true,
                        severity: "error",
                        text: parseError(err),
                    });
                });
        },
        [fetchCodes, setNotification]
    );

    const handleSync = useCallback(() => {
        fetchCodes();
    }, [fetchCodes]);

    return (
        <Box display="flex" flexWrap="wrap" gap={2}>
            <Box sx={{ width: "100%", display: "flex ", justifyContent: "flex-end" }}>
                <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<Sync />}
                    onClick={handleSync}
                >
                    Sync Now
                </Button>
            </Box>
            <Grid container spacing={2}>
                {codes.map((code) => (
                    <Grid item xs={isSmallScreen ? 6 : 4} key={code.code}>
                        <Card>
                            <CardHeader title={code.code} />
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    {code.description || "No description"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Created at:{" "}
                                    {code?.createdAt &&
                                        new Date(code.createdAt).toDateString()}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <IconButton
                                    onClick={() => handleDelete(code.code)}
                                    color="error"
                                >
                                    <Delete />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
});
export default ViewInviteCodes;
