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
            className="rounded-[8px] w-[300px]"
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
            <Box className="w-full cursor-pointer rounded-[8px] bg-[#444]">
                <Box className="flex w-full text-[14px] bg-[#333] rounded-tl-[8px] rounded-tr-[8px]">
                    <Box className="!ml-[15px] flex items-center w-full justify-between">
                        <Box className="flex items-center">
                            <Notifications className="!text-metahkg-grey !text-[14px]" />
                            <p className="text-metahkg-grey !ml-[10px] mt6 mb6">Notification</p>
                        </Box>
                        <Close className="hover:!text-[#fff] !text-metahkg-grey !text-[16px] !mr-[12px]" />
                    </Box>
                </Box>
                <Box className="w-full rounded-[8px]">
                    <p className="m15 text-overflow-ellipsis overflow-hidden text-[15px] leading-[19px] max-h-[38px]">
                        {notification.text}
                    </p>
                </Box>
            </Box>
        </Snackbar>
    );
}
