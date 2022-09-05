import React from "react";
import { Alert, Snackbar } from "@mui/material";
import { useNotification } from "../components/ContextProvider";

export function Notification() {
    const [notification, setNotification] = useNotification();

    return (
        <Snackbar
            className="rounded-[8px]"
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            open={notification.open}
            autoHideDuration={3000}
            onClick={() => {
                setNotification({ ...notification, open: false });
            }}
            onClose={() => {
                setNotification({ ...notification, open: false });
            }}
        >
            <Alert
                onClose={() => {
                    setNotification({ ...notification, open: false });
                }}
                severity={notification.severity || "info"}
                className="rounded-[8px] w-[300px]"
            >
                {notification.text}
            </Alert>
        </Snackbar>
    );
}
