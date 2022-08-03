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
import { useBack, useIsSmallScreen, useQuery } from "../components/ContextProvider";
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
        setTitle("Search | Metahkg");

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
