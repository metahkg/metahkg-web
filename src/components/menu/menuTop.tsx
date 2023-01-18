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

import React, { MouseEventHandler, useEffect } from "react";
import { Autorenew as AutorenewIcon } from "@mui/icons-material";
import { Box, Divider, IconButton, Tab, Tabs, Tooltip, Typography } from "@mui/material";
import { useCat, useId, useProfile, useMenuTitle, useMenuMode } from "../MenuProvider";
import { useIsSmallScreen } from "../AppContextProvider";
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
export default function MenuTop(props: {
    /** event handler when refresh is clicked */
    refresh: MouseEventHandler<HTMLButtonElement>;
    /** selected tab number*/
    selected: number;
    /** event handler for when a tab is selected */
    onClick: (e: number) => void;
}) {
    const [profile] = useProfile();
    const [category] = useCat();
    const [id] = useId();
    const [menuMode] = useMenuMode();
    const isSmallScreen = useIsSmallScreen();

    const inittitle = {
        search: "Search",
        profile: "User Profile",
        category: "Metahkg",
        recall: "Recall",
        starred: "Starred",
    }[menuMode];
    const [menuTitle, setMenuTitle] = useMenuTitle();
    const tabs = {
        search: ["Relevance", "Created", "Last Reply"],
        profile: ["Created", "Last Reply"],
        category: [isSmallScreen && menuTitle ? menuTitle : "Latest", "Viral"],
        recall: [],
        starred: [],
    }[menuMode];

    const noTitleBar = isSmallScreen && menuMode === "category";

    useEffect(() => {
        if (!menuTitle) {
            if (menuMode === "profile") {
                api.userName(profile).then((data) => {
                    setMenuTitle(data.name);
                    setTitle(`${data.name} | Metahkg`);
                });
            } else if (menuMode === "category" && category) {
                api.category(category).then((data) => {
                    setMenuTitle(data.name);
                    if (!id) setTitle(`${data.name} | Metahkg`);
                });
            }
        }
    }, [category, id, profile, setMenuTitle, menuTitle, menuMode]);

    return (
        <Box>
            {/*title and refresh and add button*/}
            <Box
                className="w-full"
                sx={{
                    bgcolor: "primary.main",
                    height:
                        ["recall", "starred"].includes(menuMode) || noTitleBar ? 50 : 90,
                }}
            >
                {!noTitleBar && (
                    <Box className="flex relative w-full justify-center items-center h-[50px]">
                        <Typography
                            sx={{ color: "secondary.main" }}
                            className="!my-0 !text-[18px] !select-none text-center whitespace-nowrap text-ellipsis overflow-hidden"
                        >
                            {menuTitle || inittitle}
                        </Typography>
                        {!isSmallScreen && (
                            <Box className="flex absolute right-[10px]">
                                <Tooltip title="Refresh" arrow>
                                    <IconButton onClick={props.refresh}>
                                        <AutorenewIcon className="!text-white" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}
                    </Box>
                )}
                {/*now should be latest and viral*/}
                {Boolean(tabs.length) && (
                    <Box
                        sx={{ height: noTitleBar ? 50 : 40 }}
                        className="flex w-full items-end"
                    >
                        <Tabs
                            className="w-full"
                            value={props.selected}
                            textColor="secondary"
                            indicatorColor="secondary"
                            variant="fullWidth"
                            onChange={(e, v) => {
                                props.onClick(v);
                            }}
                        >
                            {tabs.map((tab, index) => (
                                <Tab
                                    key={index}
                                    className="!text-[15px] !normal-case"
                                    value={index}
                                    label={tab}
                                    disableRipple
                                />
                            ))}
                        </Tabs>
                    </Box>
                )}
            </Box>
            <Divider />
        </Box>
    );
}
