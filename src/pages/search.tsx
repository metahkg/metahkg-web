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

import React, { useEffect, useLayoutEffect } from "react";
import { Box } from "@mui/material";
import Template from "../components/template";
import {
    useReFetch,
    useMenu,
    useMenuMode,
    useSelected,
    useMenuTitle,
} from "../components/MenuProvider";
import {
    useBack,
    useIsSmallScreen,
    useQuery,
    useServerConfig,
} from "../components/AppContextProvider";
import { setTitle } from "../lib/common";
import queryString from "query-string";
import { useNavigate } from "react-router-dom";

export default function Search() {
    const [menu, setMenu] = useMenu();
    const [menuMode, setMenuMode] = useMenuMode();
    const [back, setBack] = useBack();
    const [, setReFetch] = useReFetch();
    const [query, setQuery] = useQuery();
    const isSmallScreen = useIsSmallScreen();
    const [selected, setSelected] = useSelected();
    const [, setMenuTitle] = useMenuTitle();
    const [serverConfig] = useServerConfig();
    const navigate = useNavigate();
    const querystring = queryString.parse(window.location.search);

    useEffect(() => {
        if (querystring.q) setQuery(decodeURIComponent(String(querystring.q)));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        navigate(`${window.location.pathname}?q=${encodeURIComponent(query)}`);
    }, [navigate, query]);

    useLayoutEffect(() => {
        setTitle(`Search | ${serverConfig?.branding || "Metahkg"}`);

        function clearData() {
            setReFetch(true);
            selected && setSelected(0);
            setMenuTitle("");
        }

        back !== window.location.pathname &&
            setBack(window.location.pathname + window.location.search);

        !menu && setMenu(true);

        if (menuMode !== "search") {
            clearData();
            setMenuMode("search");
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
    ]);

    return (
        <Box
            className="flex min-h-screen"
            sx={{
                bgcolor: "primary.dark",
            }}
        >
            {!isSmallScreen && <Template />}
        </Box>
    );
}
