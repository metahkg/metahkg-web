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

import React, { useLayoutEffect } from "react";
import { Box, Typography } from "@mui/material";
import MetahkgLogo from "../components/logo";
import { useMenu } from "../components/MenuProvider";
import { setTitle } from "../lib/common";

/**
 * 403 page
 */
export default function Forbidden() {
    const [menu, setMenu] = useMenu();

    useLayoutEffect(() => {
        setTitle("403 Forbidden | Metahkg");
        menu && setMenu(false);
    }, [menu, setMenu]);

    return (
        <Box
            className="flex items-center justify-center min-h-screen w-screen"
            sx={{ bgcolor: "primary.dark" }}
        >
            <MetahkgLogo
                className="!mr-[10px] !mb-[20px]"
                svg
                light
                height={100}
                width={80}
            />
            <Typography variant="h3">403 Forbidden</Typography>
        </Box>
    );
}
