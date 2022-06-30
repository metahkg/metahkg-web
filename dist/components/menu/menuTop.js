import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./css/top.css";
import { useEffect } from "react";
import { Add as AddIcon, Autorenew as AutorenewIcon } from "@mui/icons-material";
import { Box, Divider, IconButton, Tab, Tabs, Tooltip, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import SideBar from "../sidebar";
import { useCat, useId, useProfile, useRecall, useSearch, useMenuTitle, } from "../MenuProvider";
import { useIsSmallScreen } from "../ContextProvider";
import { api } from "../../lib/api";
import { setTitle } from "../../lib/common";
/**
 * The top part of the menu consists of a title part
 * (sidebar, title, refresh and create thread button link)
 * and a buttons part (normally two to three buttons)
 * which serve as tabs to decide the data fetch location
 * @param {MouseEventHandler<HTMLButtonElement>} props.refresh event handler for when refresh is clicked
 * @param {number} props.selected selected tab number
 * @param {(e: number) => void} props.onClick event handler for when a tab is selected
 */
export default function MenuTop(props) {
    const [search] = useSearch();
    const [profile] = useProfile();
    const [category] = useCat();
    const [recall] = useRecall();
    const [id] = useId();
    const isSmallScreen = useIsSmallScreen();
    const mode = (search && "search") || (profile && "profile") || (recall && "recall") || "menu";
    const inittitle = {
        search: "Search",
        profile: "User Profile",
        menu: "Metahkg",
        recall: "Recall",
    }[mode];
    const [menuTitle, setMenuTitle] = useMenuTitle();
    const tabs = {
        search: ["Relevance", "Created", "Last Reply"],
        profile: ["Created", "Last Reply"],
        menu: [isSmallScreen && menuTitle ? menuTitle : "Latest", "Viral"],
        recall: [],
    }[mode];
    const mobileTop = mode !== "menu";
    useEffect(() => {
        if (!search && !recall && !menuTitle && (category || profile || id)) {
            if (profile) {
                api.profile
                    .userProfile({ userId: profile, nameonly: true })
                    .then((res) => {
                    setMenuTitle(res.data.name);
                    setTitle(`${res.data.name} | Metahkg`);
                });
            }
            else {
                api.category.info({ categoryId: category, threadId: id }).then((res) => {
                    setMenuTitle(res.data.name);
                    if (!id)
                        setTitle(`${res.data.name} | Metahkg`);
                });
            }
        }
    }, [category, id, profile, recall, search, setMenuTitle, menuTitle]);
    return (_jsxs("div", { children: [_jsxs(Box, Object.assign({ className: "fullwidth menutop-root", sx: {
                    bgcolor: "primary.main",
                    height: recall ? 50 : isSmallScreen && !mobileTop ? 50 : 90,
                } }, { children: [Boolean(isSmallScreen ? mobileTop : 1) && (_jsxs("div", Object.assign({ className: `flex fullwidth align-center menutop-top justify-${isSmallScreen ? "center" : "space-between"}` }, { children: [!isSmallScreen && (_jsx("div", Object.assign({ className: "ml10 mr40" }, { children: _jsx(SideBar, {}) }))), _jsx(Typography, Object.assign({ sx: { color: "secondary.main" }, className: "novmargin font-size-18-force user-select-none text-align-center nowrap text-overflow-ellipsis overflow-hidden" }, { children: menuTitle || inittitle })), !isSmallScreen && (_jsxs("div", Object.assign({ className: "flex" }, { children: [_jsx(Tooltip, Object.assign({ title: "Refresh", arrow: true }, { children: _jsx(IconButton, Object.assign({ onClick: props.refresh }, { children: _jsx(AutorenewIcon, { className: "force-white" }) })) })), _jsx(Tooltip, Object.assign({ title: "Create thread", arrow: true }, { children: _jsx(Link, Object.assign({ className: "flex", to: "/create" }, { children: _jsx(IconButton, Object.assign({ className: "mr10" }, { children: _jsx(AddIcon, { className: "force-white" }) })) })) }))] })))] }))), Boolean(tabs.length) && (_jsx(Box, Object.assign({ sx: { height: isSmallScreen && !mobileTop ? 50 : 40 }, className: "flex fullwidth align-flex-end" }, { children: _jsx(Tabs, Object.assign({ className: "fullwidth", value: props.selected, textColor: "secondary", indicatorColor: "secondary", variant: "fullWidth", onChange: (e, v) => {
                                props.onClick(v);
                            } }, { children: tabs.map((tab, index) => (_jsx(Tab, { className: "font-size-15-force notexttransform", value: index, label: tab, disableRipple: true }, index))) })) })))] })), _jsx(Divider, {})] }));
}
//# sourceMappingURL=menuTop.js.map