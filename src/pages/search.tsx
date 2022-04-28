import React from "react";
import { Box } from "@mui/material";
import Template from "../components/template";
import {
    useCat,
    useData,
    useId,
    useMenu,
    useRecall,
    useSearch,
    useSelected,
    useMenuTitle,
} from "../components/MenuProvider";
import { useBack, useIsSmallScreen } from "../components/ContextProvider";
import { setTitle } from "../lib/common";

export default function Search() {
    const [search, setSearch] = useSearch();
    const [recall, setRecall] = useRecall();
    const [menu, setMenu] = useMenu();
    const [back, setBack] = useBack();
    const [data, setData] = useData();
    const isSmallScreen = useIsSmallScreen();
    const [selected, setSelected] = useSelected();
    const [, setMenuTitle] = useMenuTitle();
    const [id, setId] = useId();
    const [cat, setCat] = useCat();
    setTitle("Search | Metahkg");
    back !== window.location.pathname &&
        setBack(window.location.pathname + window.location.search);
    !menu && setMenu(true);
    id && setId(0);
    cat && setCat(0);
    if (!search) {
        setSearch(true);
        data && setData([]);
        selected && setSelected(0);
        setMenuTitle("");
    }
    recall && setRecall(false);
    return (
        <Box
            className="flex min-height-fullvh"
            sx={{
                bgcolor: "primary.dark",
            }}
        >
            {!(isSmallScreen) && <Template />}
        </Box>
    );
}
