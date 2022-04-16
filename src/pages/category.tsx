import React from "react";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import Empty from "../components/empty";
import { useBack, useCategories, useWidth } from "../components/ContextProvider";
import {
    useCat,
    useData,
    useId,
    useMenu,
    useProfile,
    useRecall,
    useSearch,
    useSelected,
    useTitle,
} from "../components/MenuProvider";

/**
 * It's a function that
 * returns a component that renders a box with a background color
 * @returns The empty component is being returned.
 */
export default function Category() {
    const params = useParams();
    const [id, setId] = useId();
    const [menu, setMenu] = useMenu();
    const [category, setCategory] = useCat();
    const [search, setSearch] = useSearch();
    const [profile, setProfile] = useProfile();
    const [back, setBack] = useBack();
    const [recall, setRecall] = useRecall();
    const [, setData] = useData();
    const [width] = useWidth();
    const [, setTitle] = useTitle();
    const [selected, setSelected] = useSelected();
    const categories = useCategories();

    // set the title, in future categories may be just fetch from server and store in redux
    document.title = categories.find((i) => i.id === category)?.name + " | Metahkg";

    function cleardata() {
        setData([]);
        setTitle("");
        setSelected(0);
    }

    back !== window.location.pathname && setBack(window.location.pathname);

    // if menu is not open, open it
    !menu && setMenu(true);

    // clear data, if category in context is not updated  or  search/profile/recall have some value
    (category !== Number(params.category) || search || profile || recall) && cleardata();

    // update the category in context
    category !== Number(params.category) && setCategory(Number(params.category));

    id && setId(0);
    search && setSearch(false);
    recall && setRecall(false);
    profile && setProfile(0);
    ![0, 1].includes(selected) && setSelected(0);
    return (
        <Box
            className="flex"
            sx={{
                backgroundColor: "primary.dark",
            }}
        >
            {/*if not enough width , dont show the default screen, in this case, just left menu will be shown */}
            {!(width < 760) && <Empty />}
        </Box>
    );
}
