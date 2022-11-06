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
import { Box, IconButton } from "@mui/material";
import SideBar from "./sidebar";
import { useIsSmallScreen } from "./AppContextProvider";

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
