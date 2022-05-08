import "./css/menu.css";
import React, {memo} from "react";
import {Box} from "@mui/material";
import {useData, useMenu, useSearch, useSelected} from "./MenuProvider";
import {useBack, useQuery, useSettingsOpen} from "./ContextProvider";

import {useNavigate} from "react-router-dom";
import loadable from "@loadable/component";
import {Add, Autorenew, Settings} from "@mui/icons-material";

const Dock = loadable(() => import("./dock"));
const SearchBar = loadable(() => import("./searchbar"));
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
    let tempq = decodeURIComponent(query || "");
    return (
        <Box
            className={`max-width-full min-height-fullvh flex-dir-column ${
                menu ? "flex" : "display-none"
            } menu-root`}
        >
            {/*show when screen is not wide enough*/}
            <Dock
                btns={[
                    {
                        icon: <Autorenew/>,
                        action: () => {
                            setData([]);
                        },
                    },
                    {
                        icon: <Add/>,
                        action: () => {
                            navigate("/create");
                        },
                    },
                    {
                        icon: <Settings/>,
                        action: () => {
                            setSettingsOpen(true);
                        },
                    },
                ]}
            />
            {/*title and refresh and add button*/}
            {/*latest and viral*/}
            <MenuTop
                refresh={() => {
                    setData([]);
                }}
                onClick={(e: number) => {
                    if (selected !== e) {
                        setSelected(e);
                        setData([]);
                    }
                }}
                selected={selected}
            />
            {/*if search something in drawer, also show the search bar under the tab (Relevance, topic ,last reply*/}
            {search && (
                <div className="flex fullwidth">
                    <div className="flex fullwidth justify-center align-center m10 menu-search">
                        <SearchBar
                            onChange={(e) => {
                                tempq = e.target.value;
                            }}
                            onKeyPress={(e) => {
                                if (e.key === "Enter" && tempq) {
                                    // navigate with router lib
                                    navigate(`/search?q=${encodeURIComponent(tempq)}`);

                                    setQuery(tempq);
                                    setData([]);
                                    setBack(`/search?q=${encodeURIComponent(tempq)}`);
                                }
                            }}
                        />
                    </div>
                </div>
            )}
            <MenuBody/>
        </Box>
    );
}

export default memo(Menu);
