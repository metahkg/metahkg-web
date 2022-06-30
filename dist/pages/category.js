import { jsx as _jsx } from "react/jsx-runtime";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import Template from "../components/template";
import { useBack, useCategories, useIsSmallScreen } from "../components/ContextProvider";
import { useCat, useData, useId, useMenu, useProfile, useRecall, useSearch, useSelected, useMenuTitle, } from "../components/MenuProvider";
import { setTitle } from "../lib/common";
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
    const isSmallScreen = useIsSmallScreen();
    const [, setMenuTitle] = useMenuTitle();
    const [selected, setSelected] = useSelected();
    const categories = useCategories();
    (function onRender() {
        var _a;
        const categoryName = (_a = categories.find((i) => i.id === category)) === null || _a === void 0 ? void 0 : _a.name;
        categoryName && setTitle(categoryName + " | Metahkg");
        function clearData() {
            setData([]);
            setMenuTitle("");
            setSelected(0);
        }
        back !== window.location.pathname && setBack(window.location.pathname);
        // if menu is not open, open it
        !menu && setMenu(true);
        // clear data, if category in context is not updated  or  search/profile/recall have some value
        (category !== Number(params.category) || search || profile || recall) &&
            clearData();
        // update the category in context
        category !== Number(params.category) && setCategory(Number(params.category));
        id && setId(0);
        search && setSearch(false);
        recall && setRecall(false);
        profile && setProfile(0);
        ![0, 1].includes(selected) && setSelected(0);
    })();
    return (_jsx(Box, Object.assign({ className: "flex", sx: {
            backgroundColor: "primary.dark",
        } }, { children: !isSmallScreen && _jsx(Template, {}) })));
}
//# sourceMappingURL=category.js.map