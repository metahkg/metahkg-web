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
import { useBack, useIsSmallScreen } from "../components/ContextProvider";

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

    }, [back, isSmallScreen, menu, menuMode, params.id, profile, selected, setMenuTitle, setReFetch, setSelected, setMenuMode, setMenu, setBack, setProfile]);

    if (!isSmallScreen) return <Navigate to={`/profile/${params.id}`} replace />

    return <React.Fragment />;
}
