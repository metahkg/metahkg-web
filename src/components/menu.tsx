import "../css/components/menu.css";
import React, { memo } from "react";
import { Box } from "@mui/material";
import {
    useData,
    useMenu,
    useProfile,
    useRecall,
    useSearch,
    useSelected,
} from "./MenuProvider";
import { useBack, useQuery, useSettingsOpen } from "./ContextProvider";
import SearchBar from "./searchbar";
import { useNavigate } from "react-router-dom";
import loadable from "@loadable/component";
import { Add, Autorenew, Settings } from "@mui/icons-material";
import SwipeableViews from "react-swipeable-views";
import { virtualize } from "react-swipeable-views-utils";

const VirtualizeSwipeableViews = virtualize(SwipeableViews);

const Dock = loadable(() => import("./dock"));
const MenuTop = loadable(() => import("./menu/menuTop"));
const MenuBody = loadable(() => import("./menu/menuBody"));

function Menu() {
    const [selected, setSelected] = useSelected();
    const [, setData] = useData();
    const [menu] = useMenu();
    const [search] = useSearch();
    const [profile] = useProfile();
    const [recall] = useRecall();
    const [query, setQuery] = useQuery();
    const [, setBack] = useBack();
    const navigate = useNavigate();
    const [, setSettingsOpen] = useSettingsOpen();

    const mode =
        (search && "search") || (profile && "profile") || (recall && "recall") || "menu";

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
                        icon: <Autorenew />,
                        action: () => {
                            setData([]);
                        },
                    },
                    {
                        icon: <Add />,
                        action: () => {
                            navigate("/create");
                        },
                    },
                    {
                        icon: <Settings />,
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
            {/*if search something in drawer, also show the search bar under the tab (Relevance, created, last reply*/}
            {search && (
                <div className="flex fullwidth">
                    <div className="flex fullwidth justify-center align-center m10 menu-search">
                        <SearchBar
                            onChange={(e) => {
                                setQuery(e.target.value);
                            }}
                            onKeyPress={(e) => {
                                if (e.key === "Enter" && query) {
                                    // navigate with router lib
                                    navigate(`/search?q=${encodeURIComponent(query)}`);
                                    setData([]);
                                    setBack(`/search?q=${encodeURIComponent(query)}`);
                                }
                            }}
                        />
                    </div>
                </div>
            )}
            <VirtualizeSwipeableViews
                key={mode}
                index={selected}
                onChangeIndex={(idx) => {
                    console.log(idx);
                    setSelected(idx);
                }}
                containerStyle={{ flex: 1 }}
                slideCount={{ menu: 2, profile: 2, search: 3, recall: 1 }[mode]}
                slideRenderer={({ key, index }) => <MenuBody key={selected} />}
                enableMouseEvents={true}
            />
        </Box>
    );
}

export default memo(Menu);
