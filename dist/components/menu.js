import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./css/menu.css";
import { memo } from "react";
import { Box } from "@mui/material";
import { useData, useMenu, useSearch, useSelected } from "./MenuProvider";
import { useBack, useQuery, useSettingsOpen } from "./ContextProvider";
import SearchBar from "./searchbar";
import { useNavigate } from "react-router-dom";
import loadable from "@loadable/component";
import { Add, Autorenew, Settings } from "@mui/icons-material";
const Dock = loadable(() => import("./dock"));
const MenuTop = loadable(() => import("./menu/menuTop"));
const MenuBody = loadable(() => import("./menu/menuBody"));
function Menu() {
    const [selected, setSelected] = useSelected();
    const [, setData] = useData();
    const [menu] = useMenu();
    const [search] = useSearch();
    const [query, setQuery] = useQuery();
    const [, setBack] = useBack();
    const navigate = useNavigate();
    const [, setSettingsOpen] = useSettingsOpen();
    return (_jsxs(Box, Object.assign({ className: `max-width-full min-height-fullvh flex-dir-column ${menu ? "flex" : "display-none"} menu-root` }, { children: [_jsx(Dock, { btns: [
                    {
                        icon: _jsx(Autorenew, {}),
                        action: () => {
                            setData([]);
                        },
                    },
                    {
                        icon: _jsx(Add, {}),
                        action: () => {
                            navigate("/create");
                        },
                    },
                    {
                        icon: _jsx(Settings, {}),
                        action: () => {
                            setSettingsOpen(true);
                        },
                    },
                ] }), _jsx(MenuTop, { refresh: () => {
                    setData([]);
                }, onClick: (e) => {
                    if (selected !== e) {
                        setSelected(e);
                        setData([]);
                    }
                }, selected: selected }), search && (_jsx("div", Object.assign({ className: "flex fullwidth" }, { children: _jsx("div", Object.assign({ className: "flex fullwidth justify-center align-center m10 menu-search" }, { children: _jsx(SearchBar, { onChange: (e) => {
                            setQuery(e.target.value);
                        }, onKeyPress: (e) => {
                            if (e.key === "Enter" && query) {
                                // navigate with router lib
                                navigate(`/search?q=${encodeURIComponent(query)}`);
                                setData([]);
                                setBack(`/search?q=${encodeURIComponent(query)}`);
                            }
                        } }) })) }))), _jsx(MenuBody, {})] })));
}
export default memo(Menu);
//# sourceMappingURL=menu.js.map