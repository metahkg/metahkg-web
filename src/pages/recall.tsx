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
import Template from "../components/template";
import {
    useBack,
    useIsSmallScreen,
    useServerConfig,
} from "../components/AppContextProvider";
import {
    useReFetch,
    useMenu,
    useMenuMode,
    useSelected,
    useMenuTitle,
} from "../components/MenuProvider";
import { setTitle } from "../lib/common";

/**
 * It's a function that
 * returns a component that renders a box with a background color
 * @returns The empty component is being returned.
 */
export default function Recall() {
    const [menu, setMenu] = useMenu();
    const [back, setBack] = useBack();
    const [menuMode, setMenuMode] = useMenuMode();
    const [, setReFetch] = useReFetch();
    const isSmallScreen = useIsSmallScreen();
    const [title, setMenuTitle] = useMenuTitle();
    const [selected, setSelected] = useSelected();
    const [serverConfig] = useServerConfig();

    useLayoutEffect(() => {
        setTitle(`Recall | ${serverConfig?.branding || "Metahkg"}`);

        function clearData() {
            setReFetch(true);
            title && setMenuTitle("");
            selected && setSelected(0);
        }

        back !== window.location.pathname && setBack(window.location.pathname);
        !menu && setMenu(true);

        if (menuMode !== "recall") {
            clearData();
            setMenuMode("recall");
        }
    }, [
        back,
        menu,
        menuMode,
        selected,
        serverConfig?.branding,
        setBack,
        setMenu,
        setMenuMode,
        setMenuTitle,
        setReFetch,
        setSelected,
        title,
    ]);

    return (
        <Box
            className="flex"
            sx={{
                backgroundColor: "primary.dark",
            }}
        >
            {!isSmallScreen && <Template />}
        </Box>
    );
}
