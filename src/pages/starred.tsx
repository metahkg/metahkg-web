import React, { useLayoutEffect } from "react";
import { Box } from "@mui/material";
import Template from "../components/template";
import { useBack, useIsSmallScreen } from "../components/AppContextProvider";
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
export default function Starred() {
    const [menu, setMenu] = useMenu();
    const [back, setBack] = useBack();
    const [menuMode, setMenuMode] = useMenuMode();
    const [, setReFetch] = useReFetch();
    const isSmallScreen = useIsSmallScreen();
    const [title, setMenuTitle] = useMenuTitle();
    const [selected, setSelected] = useSelected();

    useLayoutEffect(() => {
        setTitle("Starred | Metahkg");

        function clearData() {
            setReFetch(true);
            title && setMenuTitle("");
            selected && setSelected(0);
        }

        back !== window.location.pathname && setBack(window.location.pathname);
        !menu && setMenu(true);

        if (menuMode !== "starred") {
            clearData();
            setMenuMode("starred");
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
