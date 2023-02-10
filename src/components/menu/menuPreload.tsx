/*
 Copyright (C) 2022-present Metahkg Contributors

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from "react";
import { Box, Button, Divider, Skeleton } from "@mui/material";
import { roundup } from "../../lib/common";
import { useHeight, useIsSmallScreen, useWidth } from "../AppContextProvider";
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
        <Box
            className="dark:!bg-[#1e1e1e]"
            sx={{ minHeight: totalHeight, bgcolor: "primary.main" }}
        >
            {[...Array(amount)].map((_, index) => (
                <Box key={index}>
                    <Button className="w-full flex !items-start flex-col justify-center h-[72px]">
                        <Skeleton
                            className="!ml-[10px]"
                            height={90}
                            width={buttonWidth * 0.45}
                        />
                        <Box className="!ml-[10px] h-[10px]" />
                        <Skeleton
                            className="!ml-[10px]"
                            height={100}
                            width={buttonWidth * 0.8}
                        />
                    </Button>
                    <Divider />
                </Box>
            ))}
        </Box>
    );
}
