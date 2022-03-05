import "./css/notification.css";
import React from "react";
import { Close, Notifications } from "@mui/icons-material";
import { Box, Snackbar } from "@mui/material";
import { useNotification } from "../components/ContextProvider";
/**
 * Display a notification at the top right corner
 */
export function Notification() {
  const [notification, setNotification] = useNotification();
  const vertical: "top" | "bottom" = "top";
  const horizontal: "left" | "right" | "center" = "right";
  const open = notification.open;
  return (
    <Snackbar
      className="notification-root"
      sx={{
        bgcolor: "primary.main",
      }}
      anchorOrigin={{ horizontal, vertical }}
      open={open}
      autoHideDuration={3500}
      onClick={() => {
        setNotification({ ...notification, open: false });
      }}
      onClose={() => {
        setNotification({ ...notification, open: false });
      }}
    >
      <Box className="fullwidth pointer notification-mainbox">
        <Box className="flex fullwidth font-size-14 notification-top">
          <div className="ml15 flex align-center fullwidth justify-space-between">
            <div className="flex align-center">
              <Notifications className="metahkg-grey-force font-size-14-force" />
              <p className="metahkg-grey ml10 mt6 mb6">Notification</p>
            </div>
            <Close className="icon-white-onhover metahkg-grey-force font-size-16-force mr12" />
          </div>
        </Box>
        <Box className="fullwidth notification-bottom">
          <p className="m15 text-overflow-ellipsis overflow-hidden font-size-15 notification-text">
            {notification.text}
          </p>
        </Box>
      </Box>
    </Snackbar>
  );
}
