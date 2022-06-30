import "../../css/components/menu/preload.css";
import React from "react";
import { Box, Button, Divider } from "@mui/material";
import { Shimmer } from "../../lib/shimmer/shimmer";
import { roundup } from "../../lib/common";
import { useSearch } from "../MenuProvider";
import { useHeight, useIsSmallScreen, useWidth } from "../ContextProvider";
/* A component that is used to preload the menu. */
export default function MenuPreload() {
    const [search] = useSearch();
    const isSmallScreen = useIsSmallScreen();
    const [height] = useHeight();
    const [width] = useWidth();
    const totalheight = height - (search ? 151 : 91);
    const amount = roundup(totalheight / 72);
    const buttonwidth = isSmallScreen ? width : 0.3 * width;
    return (
        <Box className="preload-root" sx={{ minHeight: totalheight }}>
            {[...Array(amount)].map((_, index) => (
                <div key={index}>
                    <Button className="fullwidth flex align-flex-start flex-dir-column justify-center preload-btn">
                        <Shimmer
                            className="ml10"
                            height={18}
                            width={buttonwidth * 0.45}
                        />
                        <div className="ml10 preload-spacer" />
                        <Shimmer className="ml10" height={22} width={buttonwidth * 0.8} />
                    </Button>
                    <Divider />
                </div>
            ))}
        </Box>
    );
}
