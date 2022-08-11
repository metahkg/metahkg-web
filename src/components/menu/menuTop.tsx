import React, { MouseEventHandler, useEffect } from "react";
import { Add as AddIcon, Autorenew as AutorenewIcon } from "@mui/icons-material";
import { Box, Divider, IconButton, Tab, Tabs, Tooltip, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import SideBar from "../sidebar";
import { useCat, useId, useProfile, useMenuTitle, useMenuMode } from "../MenuProvider";
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
    }[menuMode];
    const [menuTitle, setMenuTitle] = useMenuTitle();
    const tabs = {
        search: ["Relevance", "Created", "Last Reply"],
        profile: ["Created", "Last Reply"],
        category: [isSmallScreen && menuTitle ? menuTitle : "Latest", "Viral"],
        recall: [],
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
                    height: menuMode === "recall" || noTitleBar ? 50 : 90,
                }}
            >
                {!noTitleBar && (
                    <Box
                        className={`flex w-full items-center h-[50px] justify-${
                            isSmallScreen ? "center" : "between"
                        }`}
                    >
                        {!isSmallScreen && (
                            <Box className="!ml-[10px] !mr-[40px]">
                                <SideBar />
                            </Box>
                        )}
                        <Typography
                            sx={{ color: "secondary.main" }}
                            className="!my-0 !text-[18px] !select-none text-center whitespace-nowrap text-ellipsis overflow-hidden"
                        >
                            {menuTitle || inittitle}
                        </Typography>
                        {!isSmallScreen && (
                            <Box className="flex">
                                <Tooltip title="Refresh" arrow>
                                    <IconButton onClick={props.refresh}>
                                        <AutorenewIcon className="!text-white" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Create thread" arrow>
                                    <Link className="flex" to="/create">
                                        <IconButton className="!mr-[10px]">
                                            <AddIcon className="!text-white" />
                                        </IconButton>
                                    </Link>
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
