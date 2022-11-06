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
import { useParams } from "react-router-dom";
import Template from "../components/template";
import {
    useBack,
    useCategories,
    useIsSmallScreen,
} from "../components/AppContextProvider";
import {
    useCat,
    useReFetch,
    useMenu,
    useSelected,
    useMenuTitle,
    useMenuMode,
} from "../components/MenuProvider";
import { setTitle } from "../lib/common";

/**
 * It's a function that
 * returns a component that renders a box with a background color
 * @returns The empty component is being returned.
 */
export default function Category() {
    const params = useParams();
    const [menu, setMenu] = useMenu();
    const [menuMode, setMenuMode] = useMenuMode();
    const [category, setCategory] = useCat();
    const [back, setBack] = useBack();
    const [, setReFetch] = useReFetch();
    const isSmallScreen = useIsSmallScreen();
    const [, setMenuTitle] = useMenuTitle();
    const [selected, setSelected] = useSelected();
    const categories = useCategories();

    useLayoutEffect(() => {
        const categoryName = categories.find((i) => i.id === category)?.name;
        categoryName && setTitle(categoryName + " | Metahkg");

        function clearData() {
            setReFetch(true);
            setMenuTitle("");
            if (selected !== 0) setSelected(0);
        }

        back !== window.location.pathname && setBack(window.location.pathname);

        // if menu is not open, open it
        !menu && setMenu(true);

        // clear data, if category in context is not updated  or  search/profile/recall have some value
        if (menuMode !== "category" || category !== Number(params.category)) clearData();

        if (menuMode !== "category") setMenuMode("category");

        // update the category in context
        if (category !== Number(params.category)) setCategory(Number(params.category));
    }, [
        back,
        categories,
        category,
        menu,
        menuMode,
        params.category,
        selected,
        setBack,
        setCategory,
        setMenu,
        setMenuMode,
        setMenuTitle,
        setReFetch,
        setSelected,
    ]);

    return (
        <Box
            className="flex"
            sx={{
                backgroundColor: "primary.dark",
            }}
        >
            {/*if not enough width , dont show the default screen, in this case, just left menu will be shown */}
            {!isSmallScreen && <Template />}
        </Box>
    );
}
