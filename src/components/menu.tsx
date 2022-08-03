import "../css/components/menu.css";
import React, { memo, useCallback, useMemo } from "react";
import { Box } from "@mui/material";
import { useReFetch, useMenu, useSelected, useSmode, useMenuMode } from "./MenuProvider";
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
            } menu-root`}
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
                    <Box className="flex w-full justify-center items-center m10 menu-search">
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
                            { category: 2, profile: 2, search: 3, recall: 1 }[menuMode]
                        }
                        slideRenderer={slideRenderer}
                        enableMouseEvents={true}
                    />
                ),
                [menuMode, selected, setSelected, slideRenderer]
            )}
        </Box>
    );
}

export default memo(Menu);
