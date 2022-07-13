import "../css/components/dock.css";
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
        <div>
            {isSmallScreen && (
                <Box
                    className="flex fullwidth dock-root"
                    sx={{ bgcolor: "primary.dark", height: 60 }}
                >
                    <div className="flex justify-space-between fullwidth ml20 mr20 align-center">
                        <SideBar />
                        {btns.map((btn, index) => (
                            <IconButton key={index} onClick={btn.action}>
                                {btn.icon}
                            </IconButton>
                        ))}
                    </div>
                </Box>
            )}
        </div>
    );
}
