import { jsx as _jsx } from "react/jsx-runtime";
import { Box } from "@mui/material";
import Template from "../components/template";
import { useBack, useIsSmallScreen } from "../components/ContextProvider";
import { useCat, useData, useId, useMenu, useProfile, useRecall, useSearch, useSelected, useMenuTitle, } from "../components/MenuProvider";
import { setTitle } from "../lib/common";
/**
 * It's a function that
 * returns a component that renders a box with a background color
 * @returns The empty component is being returned.
 */
export default function Recall() {
    setTitle("Recall | Metahkg");
    const [id, setId] = useId();
    const [menu, setMenu] = useMenu();
    const [category, setCategory] = useCat();
    const [search, setSearch] = useSearch();
    const [profile, setProfile] = useProfile();
    const [back, setBack] = useBack();
    const [recall, setRecall] = useRecall();
    const [data, setData] = useData();
    const isSmallScreen = useIsSmallScreen();
    const [title, setMenuTitle] = useMenuTitle();
    const [selected, setSelected] = useSelected();
    (function onRender() {
        function clearData() {
            data.length && setData([]);
            title && setMenuTitle("");
            selected && setSelected(0);
        }
        back !== window.location.pathname && setBack(window.location.pathname);
        !menu && setMenu(true);
        (category || search || profile || !recall) && clearData();
        id && setId(0);
        category && setCategory(0);
        search && setSearch(false);
        profile && setProfile(0);
        !recall && setRecall(true);
        ![0, 1].includes(selected) && setSelected(0);
    })();
    return (_jsx(Box, Object.assign({ className: "flex", sx: {
            backgroundColor: "primary.dark",
        } }, { children: !isSmallScreen && _jsx(Template, {}) })));
}
//# sourceMappingURL=recall.js.map