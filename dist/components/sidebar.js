import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./css/sidebar.css";
import { useState } from "react";
import { Box, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Typography, } from "@mui/material";
import { AccessTimeFilled, AccountCircle as AccountCircleIcon, Code as CodeIcon, Logout as LogoutIcon, ManageAccounts as ManageAccountsIcon, Menu as MenuIcon, Settings as SettingsIcon, Telegram as TelegramIcon, } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SearchBar from "./searchbar";
import { useCategories, useQuery, useSettingsOpen, useUser } from "./ContextProvider";
import { wholePath } from "../lib/common";
import { useCat, useProfile, useSearch } from "./MenuProvider";
import MetahkgLogo from "./logo";
/**
 * The sidebar is a
 * drawer that is opened by clicking on the menu icon on the top left of the
 * screen. It contains a list of links to different pages
 */
export default function SideBar() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useQuery();
    const [cat] = useCat();
    const [profile] = useProfile();
    const [search] = useSearch();
    const [, setSettingsOpen] = useSettingsOpen();
    const [user] = useUser();
    const categories = useCategories();
    const navigate = useNavigate();
    const toggleDrawer = (open) => (event) => {
        if (event.type === "keydown" &&
            (event.key === "Tab" ||
                event.key === "Shift")) {
            return;
        }
        setOpen(open);
    };
    function onClick() {
        setOpen(false);
    }
    return (_jsxs("div", { children: [_jsx("div", { children: _jsx(IconButton, Object.assign({ className: "sidebar-menu-btn", onClick: toggleDrawer(true) }, { children: _jsx(MenuIcon, { className: "force-white" }) })) }), _jsx(Drawer, Object.assign({ anchor: "left", open: open, onClose: toggleDrawer(false), PaperProps: {
                    sx: {
                        backgroundImage: "none",
                        backgroundColor: "primary.main",
                    },
                } }, { children: _jsxs(Box, Object.assign({ className: "sidebar-box max-width-full", role: "presentation" }, { children: [_jsxs("div", Object.assign({ className: "fullwidth" }, { children: [_jsx(List, Object.assign({ className: "fullwidth" }, { children: _jsxs(ListItemButton, Object.assign({ onClick: onClick, component: "a", href: "https://war.ukraine.ua/support-ukraine/", className: "text-decoration-none white" }, { children: [_jsx(ListItemIcon, { children: _jsx(MetahkgLogo, { height: 24, width: 30, ua: true }) }), _jsx(ListItemText, { children: "Support Ukraine" })] })) })), _jsx("div", Object.assign({ className: "ml10 mr10" }, { children: _jsx(SearchBar, { onChange: (e) => {
                                            setQuery(e.target.value);
                                        }, onKeyPress: (e) => {
                                            if (e.key === "Enter" && query) {
                                                navigate(`/search?q=${encodeURIComponent(query)}`);
                                                setOpen(false);
                                            }
                                        } }) }))] })), _jsx(List, { children: [
                                {
                                    title: "Recall",
                                    link: "/recall",
                                    icon: _jsx(AccessTimeFilled, {}),
                                },
                                {
                                    title: user ? "Logout" : "Login / Register",
                                    link: `/users/${user ? "logout" : "login"}?returnto=${encodeURIComponent(wholePath())}`,
                                    icon: user ? _jsx(LogoutIcon, {}) : _jsx(AccountCircleIcon, {}),
                                },
                            ].map((item, index) => (_jsxs(ListItemButton, Object.assign({ component: Link, onClick: onClick, to: item.link, className: "text-decoration-none white" }, { children: [_jsx(ListItemIcon, { children: item.icon }), _jsx(ListItemText, { children: item.title })] }), index))) }), _jsx(Divider, {}), [
                            categories.filter((i) => !i.hidden),
                            user && categories.filter((i) => i.hidden),
                        ].map((cats, index) => cats && (_jsx("div", { children: _jsx("div", Object.assign({ className: `m20${user && !index ? " mb10" : ""}${index ? " mt0" : ""}` }, { children: cats.map((category, index) => (_jsx(Link, Object.assign({ to: `/category/${category.id}`, className: "notextdecoration" }, { children: _jsx(Typography, Object.assign({ className: "font-size-16-force text-align-left halfwidth sidebar-catlink", sx: (theme) => ({
                                            color: cat === category.id &&
                                                !(profile || search)
                                                ? theme.palette.secondary
                                                    .main
                                                : "white",
                                            "&:hover": {
                                                color: `${theme.palette.secondary.main} !important`,
                                            },
                                        }), onClick: onClick }, { children: category.name })) }), index))) })) }, index))), _jsx(Divider, {}), _jsx(List, { children: [
                                {
                                    icon: _jsx(TelegramIcon, {}),
                                    title: "Telegram group",
                                    link: "https://t.me/+WbB7PyRovUY1ZDFl",
                                },
                                {
                                    icon: _jsx(CodeIcon, {}),
                                    title: "Source code",
                                    link: "https://gitlab.com/metahkg/metahkg",
                                },
                            ].map((item, index) => (_jsxs(ListItemButton, Object.assign({ component: "a", onClick: onClick, className: "text-decoration-none white", href: item.link }, { children: [_jsx(ListItemIcon, { children: item.icon }), _jsx(ListItemText, { primary: item.title })] }), index))) }), _jsx(Divider, {}), _jsxs(List, { children: [user && (_jsxs(ListItemButton, Object.assign({ component: Link, className: "text-decoration-none white", to: `/profile/${user === null || user === void 0 ? void 0 : user.id}`, onClick: onClick }, { children: [_jsx(ListItemIcon, { children: _jsx(ManageAccountsIcon, {}) }), _jsx(ListItemText, { children: user === null || user === void 0 ? void 0 : user.name })] }))), _jsxs(ListItemButton, Object.assign({ onClick: () => {
                                        setOpen(false);
                                        setSettingsOpen(true);
                                    } }, { children: [_jsx(ListItemIcon, { children: _jsx(SettingsIcon, {}) }), _jsx(ListItemText, { children: "Settings" })] }))] }), _jsxs("p", Object.assign({ className: "ml5" }, { children: ["Metahkg Web ", process.env.REACT_APP_build || "v2.2.0"] }))] })) }))] }));
}
//# sourceMappingURL=sidebar.js.map