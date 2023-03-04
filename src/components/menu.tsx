/*
 Copyright (C) 2022-present Metahkg Contributors

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React, { memo, useCallback, useMemo } from "react";
import { Box } from "@mui/material";
import { useReFetch, useMenu, useSelected, useSmode, useMenuMode } from "./MenuProvider";
import { useBack, useQuery, useSettingsOpen } from "./AppContextProvider";
import SearchBar from "./searchBar";
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
    const [data, setReFetch] = useReFetch();
    const [menu] = useMenu();
    const [menuMode] = useMenuMode();
    const [smode] = useSmode();

    const [query, setQuery] = useQuery();
    const [, setBack] = useBack();
    const navigate = useNavigate();
    const [, setSettingsOpen] = useSettingsOpen();

    const slideRenderer = useCallback(
        (props: { key: number; index: number }) => {
            const { index } = props;
            return <MenuBody key={index} selected={index} />;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [data, smode]
    );

    return (
        <Box
            className={`max-w-full min-h-screen flex-col ${
                menu ? "flex" : "hidden"
            } dark:!bg-[#1e1e1e]`}
            sx={{ bgcolor: "primary.main" }}
        >
            {/*show when screen is not wide enough*/}
            <Dock
                btns={[
                    {
                        icon: <Autorenew />,
                        action: () => {
                            setReFetch(true);
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
                    setReFetch(true);
                }}
                onClick={(e: number) => {
                    if (selected !== e) {
                        setSelected(e);
                    }
                }}
                selected={selected}
            />
            {/*if search something in drawer, also show the search bar under the tab (Relevance, created, last reply*/}
            {menuMode === "search" && (
                <Box className="flex w-full">
                    <Box className="flex w-full justify-center items-center m-2 h-[39px]">
                        <SearchBar
                            query={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                            }}
                            onKeyPress={(e) => {
                                if (e.key === "Enter" && query) {
                                    // navigate with router lib
                                    navigate(`/search?q=${encodeURIComponent(query)}`);
                                    setReFetch(true);
                                    setBack(`/search?q=${encodeURIComponent(query)}`);
                                }
                            }}
                        />
                    </Box>
                </Box>
            )}
            {useMemo(
                () => (
                    <VirtualizeSwipeableViews
                        key={menuMode}
                        index={selected}
                        onChangeIndex={(idx) => {
                            setSelected(idx);
                        }}
                        containerStyle={{ flex: 1 }}
                        slideCount={
                            { category: 2, profile: 2, search: 3, recall: 1, starred: 1 }[
                                menuMode
                            ]
                        }
                        slideRenderer={slideRenderer}
                        enableMouseEvents
                    />
                ),
                [menuMode, selected, setSelected, slideRenderer]
            )}
        </Box>
    );
}

export default memo(Menu);
