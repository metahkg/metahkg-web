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
import { Box } from "@mui/material";
import {
    useIsSmallScreen,
    useSidePanelExpanded,
} from "../../components/AppContextProvider";
import { useMenu } from "../../components/MenuProvider";

export default function EnableMenu(props: {
    children: React.ReactNode;
    notOnSmallScreen?: boolean;
}) {
    const { children, notOnSmallScreen: noSmallScreen } = props;
    const [menu, setMenu] = useMenu();
    const isSmallScreen = useIsSmallScreen();
    const [sidePanelExpanded] = useSidePanelExpanded();

    useLayoutEffect(() => {
        if (!menu && (!noSmallScreen || !isSmallScreen)) setMenu(true);
        if (menu && noSmallScreen && isSmallScreen) setMenu(false);
    }, [isSmallScreen, menu, noSmallScreen, setMenu]);

    return (
        <Box
            className={`${
                menu
                    ? isSmallScreen
                        ? "w-0"
                        : sidePanelExpanded
                        ? "w-[calc(70vw-200px)] max-w-[calc(70vw-200px)]"
                        : "w-[calc(70vw-50px)] max-w-[calc(70vw-50px)]"
                    : isSmallScreen
                    ? "w-100v"
                    : sidePanelExpanded
                    ? "w-[calc(100vw-200px)] max-w-[calc(100vw-200px)]"
                    : "w-[calc(100vw-50px)] max-w-[calc(100vw-50px)]"
            } overflow-auto`}
        >
            {children}
        </Box>
    );
}
