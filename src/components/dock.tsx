import React from "react";
import { Box, IconButton } from "@mui/material";
import SideBar from "./sidebar";
import { useIsSmallScreen } from "./ContextProvider";

/**
 * mobile dock
 */
export default function Dock(props: {
    btns: { icon: JSX.Element; action: () => void }[];
}) {
    const { btns } = props;
    const isSmallScreen = useIsSmallScreen();
    return (
        <Box>
            {isSmallScreen && (
                <Box
                    className="flex w-full fixed bottom-0 right-0 z-[100]"
                    sx={{ bgcolor: "primary.dark", height: 60 }}
                >
                    <Box className="flex justify-between w-full !ml-[20px] !mr-[20px] items-center">
                        <SideBar />
                        {btns.map((btn, index) => (
                            <IconButton key={index} onClick={btn.action}>
                                {btn.icon}
                            </IconButton>
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
}
