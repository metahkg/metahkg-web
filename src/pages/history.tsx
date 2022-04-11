import React from "react";
import { Navigate, useParams } from "react-router";
import { useCat, useData, useId, useMenu, useProfile, useRecall, useSearch, useSelected, useTitle } from "../components/MenuProvider";
import { useBack, useWidth } from "../components/ContextProvider";

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
    const [width] = useWidth();
    const [selected, setSelected] = useSelected();
    const [, setTitle] = useTitle();
    const [, setData] = useData();
    const [id, setId] = useId();
    const [cat, setCat] = useCat();
    if (!(width < 760)) {
        return <Navigate to={`/profile/${params.id}`} replace />;
    }

    function cleardata() {
        setData([]);
        setTitle("");
        selected && setSelected(0);
    }

    !menu && setMenu(true);
    back !== window.location.pathname && setBack(window.location.pathname);
    (profile !== (Number(params.id) || "self") || search) && cleardata();
    profile !== (Number(params.id) || "self") && setProfile(Number(params.id) || "self");
    search && setSearch(false);
    recall && setRecall(false);
    id && setId(0);
    cat && setCat(0);
    return <div />;
}
