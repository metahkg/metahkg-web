import React from "react";
import { Navigate, useParams } from "react-router-dom";
import {
    useCat,
    useReFetch,
    useId,
    useMenu,
    useProfile,
    useRecall,
    useSearch,
    useSelected,
    useMenuTitle,
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
    const [search, setSearch] = useSearch();
    const [recall, setRecall] = useRecall();
    const [menu, setMenu] = useMenu();
    const [back, setBack] = useBack();
    const isSmallScreen = useIsSmallScreen();
    const [selected, setSelected] = useSelected();
    const [, setMenuTitle] = useMenuTitle();
    const [, setReFetch] = useReFetch();
    const [id, setId] = useId();
    const [cat, setCat] = useCat();

    if (!isSmallScreen) return <Navigate to={`/profile/${params.id}`} replace />;

    (function onRender() {
        function clearData() {
            setReFetch(true);
            setMenuTitle("");
            selected && setSelected(0);
        }

        !menu && setMenu(true);
        back !== window.location.pathname && setBack(window.location.pathname);

        (profile !== Number(params.id) || search) && clearData();
        profile !== Number(params.id) && setProfile(Number(params.id));

        search && setSearch(false);
        recall && setRecall(false);
        id && setId(0);
        cat && setCat(0);
    })();

    return <React.Fragment />;
}
