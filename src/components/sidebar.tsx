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

import React, { useState } from "react";
import { Box, Drawer, IconButton } from "@mui/material";
import SidePanel from "./sidePanel";
import { Menu as MenuIcon } from "@mui/icons-material";

/**
 * The sidebar is a
 * drawer that is opened by clicking on the menu icon on the top left of the
 * screen. It contains a list of links to different pages
 */
export default function SideBar() {
    const [open, setOpen] = useState(false);

    const toggleDrawer =
        (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
            if (
                event.type === "keydown" &&
                ((event as React.KeyboardEvent).key === "Tab" ||
                    (event as React.KeyboardEvent).key === "Shift")
            ) {
                return;
            }
            setOpen(open);
        };

    return (
        <Box>
            <Box>
                <IconButton className="h-[40px] w-[40px]" onClick={toggleDrawer(true)}>
                    <MenuIcon />
                </IconButton>
            </Box>
            <Drawer
                anchor="left"
                open={open}
                onClose={toggleDrawer(false)}
                PaperProps={{
                    sx: {
                        backgroundImage: "none",
                        backgroundColor: "",
                    },
                }}
            >
                <SidePanel />
            </Drawer>
        </Box>
    );
}
