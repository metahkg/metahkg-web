import "./css/dock.css";
import React from "react";
import { Box, IconButton } from "@mui/material";
import SideBar from "./sidebar";
import { useWidth } from "./ContextProvider";

/**
 * mobile dock
 */
export default function Dock(props: {
    btns: { icon: JSX.Element; action: () => void }[];
}) {
    const { btns } = props;
    const [width] = useWidth();
    return (
        <div>
            {width < 760 && (
                <Box
                    className="flex fullwidth dock-root"
                    sx={{ bgcolor: "primary.dark", height: 50 }}
                >
                    <div className="flex justify-space-between fullwidth ml20 mr20 align-center">
                        <SideBar />
                        {btns.map((btn) => (
                            <IconButton onClick={btn.action}>{btn.icon}</IconButton>
                        ))}
                    </div>
                </Box>
            )}
        </div>
    );
}
