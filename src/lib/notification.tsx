import "./css/notification.css";
import React from "react";
import { Close, Notifications } from "@mui/icons-material";
import { Box, Snackbar } from "@mui/material";
import { useNotification } from "../components/ContextProvider";
/*
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
        <Box className="fullwidth notification-top">
          <div className="ml15 flex align-center fullwidth">
            <Notifications className="metahkg-grey-force notification-icon" />
            <p className="metahkg-grey ml10 notification-title">Notification</p>
            <div className="flex fullwidth justify-flex-end">
              <Close className="icon-white-onhover metahkg-grey-force notification-close" />
            </div>
          </div>
        </Box>
        <Box className="fullwidth notification-bottom">
          <p className="m15 text-overflow-ellipsis overflow-hidden notification-text">
            {notification.text}
          </p>
        </Box>
      </Box>
    </Snackbar>
  );
}
