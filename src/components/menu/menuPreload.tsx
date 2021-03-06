import "../../css/components/menu/preload.css";
import React from "react";
import { Box, Button, Divider, Skeleton } from "@mui/material";
import { roundup } from "../../lib/common";
import { useHeight, useIsSmallScreen, useWidth } from "../ContextProvider";
import { useMenuMode } from "../MenuProvider";
/* A component that is used to preload the menu. */
export default function MenuPreload() {
    const isSmallScreen = useIsSmallScreen();
    const [height] = useHeight();
    const [width] = useWidth();
    const [menuMode] = useMenuMode();
    const totalHeight = height - (menuMode === "search" ? 151 : 91);
    const amount = roundup(totalHeight / 72);
    const buttonWidth = isSmallScreen ? width : 0.3 * width;
    return (
        <Box className="preload-root" sx={{ minHeight: totalHeight }}>
            {[...Array(amount)].map((_, index) => (
                <div key={index}>
                    <Button className="fullwidth flex align-flex-start flex-dir-column justify-center preload-btn">
                        <Skeleton
                            className="ml10"
                            height={90}
                            width={buttonWidth * 0.45}
                        />
                        <div className="ml10 preload-spacer" />
                        <Skeleton
                            className="ml10"
                            height={100}
                            width={buttonWidth * 0.8}
                        />
                    </Button>
                    <Divider />
                </div>
            ))}
        </Box>
    );
}
