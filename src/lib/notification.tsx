import "../css/lib/notification.css";
import React from "react";
import { Close, Notifications } from "@mui/icons-material";
import { Box, Snackbar } from "@mui/material";
import { useNotification } from "../components/ContextProvider";

/**
 * Display a notification at the top right corner
 */
export function Notification() {
    const [notification, setNotification] = useNotification();
    const open = notification.open;
    return (
        <Snackbar
            className="border-radius-8 notification-root"
            sx={{
                bgcolor: "primary.main",
            }}
            anchorOrigin={{ horizontal: "right", vertical: "top" }}
            open={open}
            autoHideDuration={3000}
            onClick={() => {
                setNotification({ ...notification, open: false });
            }}
            onClose={() => {
                setNotification({ ...notification, open: false });
            }}
        >
            <Box className="fullwidth pointer border-radius-8 notification-mainbox">
                <Box className="flex fullwidth font-size-14 notification-top">
                    <Box className="ml15 flex align-center fullwidth justify-space-between">
                        <Box className="flex align-center">
                            <Notifications className="metahkg-grey-force font-size-14-force" />
                            <p className="metahkg-grey ml10 mt6 mb6">Notification</p>
                        </Box>
                        <Close className="icon-white-onhover metahkg-grey-force font-size-16-force mr12" />
                    </Box>
                </Box>
                <Box className="fullwidth notification-bottom border-radius-8">
                    <p className="m15 text-overflow-ellipsis overflow-hidden font-size-15 notification-text">
                        {notification.text}
                    </p>
                </Box>
            </Box>
        </Snackbar>
    );
}
