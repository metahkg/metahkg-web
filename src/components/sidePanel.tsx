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

import React, { useMemo, useState } from "react";
import {
    Avatar,
    Box,
    IconButton,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Tooltip,
} from "@mui/material";
import {
    AccessTimeFilled as AccessTimeFilledIcon,
    HowToReg as HowToRegIcon,
    Info as InfoIcon,
    Login as LoginIcon,
    Logout as LogoutIcon,
    Settings as SettingsIcon,
    Code as CodeIcon,
    Star as StarIcon,
    Telegram as TelegramIcon,
    Create as CreateIcon,
    Category as CategoryIcon,
    Search as SearchIcon,
    ChevronRight as ChevronRightIcon,
    ChevronLeft as ChevronLeftIcon,
} from "@mui/icons-material";
import {
    useDarkMode,
    useSettingsOpen,
    useSidePanelExpanded,
    useUser,
} from "./AppContextProvider";
import { Link } from "../lib/link";
import MetahkgLogo from "./logo";
import { AboutDialog } from "./AboutDialog";
import { CategoryPanel } from "./categoryPanel";

export default function SidePanel() {
    const [user] = useUser();
    const [, setSettingsOpen] = useSettingsOpen();
    const [aboutOpen, setAboutOpen] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [expanded, setExpanded] = useSidePanelExpanded();
    const darkMode = useDarkMode();

    const buttons = useMemo(() => {
        return [
            {
                title: "Metahkg",
                icon: <MetahkgLogo height={30} width={30} svg light={darkMode} />,
                link: "/",
            },
            user && {
                title: "Profile",
                icon: (
                    <Avatar
                        src={`${process.env.REACT_APP_BACKEND || "/api"}/users/${
                            user.id
                        }/avatar`}
                        className="!h-[30px] !w-[30px]"
                        alt={user.name}
                    />
                ),
                link: `/profile/${user.id}`,
            },
            {
                title: "Categories",
                icon: <CategoryIcon />,
                onClick: () => {
                    setCategoryOpen(true);
                },
            },
            {
                title: "Search",
                icon: <SearchIcon />,
                link: "/search",
            },
            {
                title: "Recall",
                icon: <AccessTimeFilledIcon />,
                link: "/recall",
            },
            user && {
                title: "Starred",
                icon: <StarIcon />,
                link: "/starred",
            },
            user && {
                title: "Logout",
                icon: <LogoutIcon />,
                link: "/users/logout",
            },
            !user && {
                title: "Login",
                icon: <LoginIcon />,
                link: "/users/login",
            },
            !user && {
                title: "Register",
                icon: <HowToRegIcon />,
                link: "/users/register",
            },
            {
                title: "Create thread",
                icon: <CreateIcon />,
                link: "/create",
            },
            {
                title: "Settings",
                icon: <SettingsIcon />,
                onClick: () => {
                    setSettingsOpen(true);
                },
            },
            {
                title: "Telegram group",
                icon: <TelegramIcon />,
                link: "https://t.me/+WbB7PyRovUY1ZDFl",
            },
            {
                title: "About",
                icon: <InfoIcon />,
                onClick: () => {
                    setAboutOpen(true);
                },
            },
            {
                title: "Source code",
                icon: <CodeIcon />,
                link: "https://gitlab.com/metahkg/metahkg",
            },
        ].filter((item) => item) as {
            title: string;
            icon: React.ReactElement;
            onClick?: () => void;
            link?: string;
        }[];
    }, [darkMode, setSettingsOpen, user]);

    return (
        <Box
            className={`${
                expanded ? "w-[220px]" : "w-[50px]"
            } transition-[width] ease-out duration-600 h-100v max-h-100v relative flex justify-center`}
        >
            <Box className="w-full max-h-[calc(100vh-50px)] overflow-y-scroll flex flex-col items-center bg-[#fff] dark:bg-[#111]">
                <AboutDialog open={aboutOpen} setOpen={setAboutOpen} />
                <CategoryPanel open={categoryOpen} setOpen={setCategoryOpen} />
                {buttons.map((button, index) => (
                    <Link
                        href={button.link}
                        className="!text-inherit !no-underline w-full flex justify-center"
                        target={button.link?.startsWith("/") ? undefined : "_blank"}
                        key={index}
                    >
                        {expanded ? (
                            <ListItemButton
                                onClick={button.onClick}
                                className="w-full h-[50px] flex justify-between"
                            >
                                <ListItemIcon>{button.icon}</ListItemIcon>
                                <ListItemText>{button.title}</ListItemText>
                            </ListItemButton>
                        ) : (
                            <Tooltip arrow title={button.title}>
                                <IconButton
                                    onClick={button.onClick}
                                    className="!mt-2 h-[40px] w-[40px]"
                                >
                                    {button.icon}
                                </IconButton>
                            </Tooltip>
                        )}
                    </Link>
                ))}
            </Box>
            <Box
                sx={{ bgcolor: "primary.dark" }}
                className="!absolute !bottom-0 !h-[50px] flex justify-center items-center w-full"
            >
                {expanded ? (
                    <ListItemButton
                        onClick={() => setExpanded(!expanded)}
                        className="flex justify-between"
                    >
                        <ListItemIcon>
                            <ChevronLeftIcon />
                        </ListItemIcon>
                        <ListItemText>Collapse</ListItemText>
                    </ListItemButton>
                ) : (
                    <IconButton onClick={() => setExpanded(!expanded)}>
                        <ChevronRightIcon />
                    </IconButton>
                )}
            </Box>
        </Box>
    );
}
