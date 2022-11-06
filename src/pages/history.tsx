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
import { Navigate, useParams } from "react-router-dom";
import {
    useReFetch,
    useMenu,
    useProfile,
    useSelected,
    useMenuTitle,
    useMenuMode,
} from "../components/MenuProvider";
import { useBack, useIsSmallScreen } from "../components/AppContextProvider";

/**
 * Only for small screens
 * Controls the menu to show ProfileMenu
 * @returns a div element
 */
export default function History() {
    const params = useParams();
    const [profile, setProfile] = useProfile();
    const [menu, setMenu] = useMenu();
    const [back, setBack] = useBack();
    const isSmallScreen = useIsSmallScreen();
    const [selected, setSelected] = useSelected();
    const [, setMenuTitle] = useMenuTitle();
    const [, setReFetch] = useReFetch();
    const [menuMode, setMenuMode] = useMenuMode();

    useLayoutEffect(() => {
        function clearData() {
            setReFetch(true);
            setMenuTitle("");
            selected && setSelected(0);
        }

        !menu && setMenu(true);
        back !== window.location.pathname && setBack(window.location.pathname);

        if (profile !== Number(params.id) || menuMode !== "profile") clearData();

        if (profile !== Number(params.id)) setProfile(Number(params.id));
        if (menuMode !== "profile") setMenuMode("profile");
    }, [
        back,
        isSmallScreen,
        menu,
        menuMode,
        params.id,
        profile,
        selected,
        setMenuTitle,
        setReFetch,
        setSelected,
        setMenuMode,
        setMenu,
        setBack,
        setProfile,
    ]);

    if (!isSmallScreen) return <Navigate to={`/profile/${params.id}`} replace />;

    return <React.Fragment />;
}
