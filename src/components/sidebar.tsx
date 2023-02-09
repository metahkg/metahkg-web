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

import React, { useState } from "react";
import {
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";
import {
    AccessTimeFilled,
    AccountCircle as AccountCircleIcon,
    Code as CodeIcon,
    Logout as LogoutIcon,
    ManageAccounts as ManageAccountsIcon,
    Menu as MenuIcon,
    Settings as SettingsIcon,
    Telegram as TelegramIcon,
    Star as StarIcon,
} from "@mui/icons-material";
import { Link } from "../lib/link";
import { useNavigate } from "react-router-dom";
import SearchBar from "./searchBar";
import { useCategories, useQuery, useSettingsOpen, useUser } from "./AppContextProvider";
import { wholePath } from "../lib/common";
import { useCat, useMenuMode } from "./MenuProvider";
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
    const [menuMode] = useMenuMode();
    const [, setSettingsOpen] = useSettingsOpen();
    const [user] = useUser();
    const [categories] = useCategories();

    const navigate = useNavigate();

    const toggleDrawer =
        (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
            if (
                event.type === "keydown" &&
                ((event as React.KeyboardEvent).key === "Tab" ||
                    (event as React.KeyboardEvent).key === "Shift")
            ) {
                return;
            }
            setOpen(open);
        };

    function onClick() {
        setOpen(false);
    }

    return (
        <Box>
            <Box>
                <IconButton className="h-[40px] w-[40px]" onClick={toggleDrawer(true)}>
                    <MenuIcon />
                </IconButton>
            </Box>
            <Drawer
                anchor="left"
                open={open}
                onClose={toggleDrawer(false)}
                PaperProps={{
                    sx: {
                        backgroundImage: "none",
                        backgroundColor: "primary.main",
                    },
                }}
            >
                <Box className="w-[250px] max-w-full" role="presentation">
                    <Box className="w-full">
                        <List className="w-full !text-inherit">
                            <ListItemButton
                                onClick={onClick}
                                component={"a"}
                                href="https://war.ukraine.ua/support-ukraine/"
                                className="!no-underline"
                            >
                                <ListItemIcon>
                                    <MetahkgLogo height={24} width={30} ua />
                                </ListItemIcon>
                                <ListItemText>Support Ukraine</ListItemText>
                            </ListItemButton>
                        </List>
                        <Box className="!ml-[10px] !mr-[10px]">
                            <SearchBar
                                query={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                }}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter" && query) {
                                        navigate(
                                            `/search?q=${encodeURIComponent(query)}`
                                        );
                                        setOpen(false);
                                    }
                                }}
                            />
                        </Box>
                    </Box>
                    <List>
                        {[
                            {
                                title: "Recall",
                                link: "/recall",
                                icon: <AccessTimeFilled />,
                            },
                            user && {
                                title: "Starred",
                                link: "/starred",
                                icon: <StarIcon />,
                            },
                            {
                                title: user ? "Logout" : "Login / Register",
                                link: `/users/${
                                    user ? "logout" : "login"
                                }?returnto=${encodeURIComponent(wholePath())}`,
                                icon: user ? <LogoutIcon /> : <AccountCircleIcon />,
                            },
                        ].map(
                            (item, index) =>
                                item && (
                                    <ListItemButton
                                        key={index}
                                        component={Link}
                                        onClick={onClick}
                                        href={item.link}
                                        className="!no-underline !text-inherit"
                                    >
                                        <ListItemIcon>{item.icon}</ListItemIcon>
                                        <ListItemText>{item.title}</ListItemText>
                                    </ListItemButton>
                                )
                        )}
                    </List>
                    <Divider />
                    {[
                        categories.filter((i) => !i.hidden),
                        user && categories.filter((i) => i.hidden),
                    ].map(
                        (cats, index) =>
                            cats && (
                                <Box key={index}>
                                    <Box
                                        className={`m-[20px]${
                                            user && !index ? " !mb-[10px]" : ""
                                        }${index ? " !mt-[0px]" : ""}`}
                                    >
                                        {cats.map((category, index) => (
                                            <Link
                                                key={index}
                                                to={`/category/${category.id}`}
                                                className="!no-underline"
                                            >
                                                <Typography
                                                    className="!text-[16px] text-left w-1/2 inline-block !leading-[35px] hover:!text-[#fbc308]"
                                                    sx={(theme) => ({
                                                        color:
                                                            cat === category.id &&
                                                            menuMode === "category"
                                                                ? theme.palette.secondary
                                                                      .main
                                                                : "white",
                                                        "&:hover": {
                                                            color: `${theme.palette.secondary.main} !important`,
                                                        },
                                                    })}
                                                    onClick={onClick}
                                                >
                                                    {category.name}
                                                </Typography>
                                            </Link>
                                        ))}
                                    </Box>
                                </Box>
                            )
                    )}
                    <Divider />
                    <List>
                        {[
                            {
                                icon: <TelegramIcon />,
                                title: "Telegram group",
                                link: "https://t.me/+WbB7PyRovUY1ZDFl",
                            },
                            {
                                icon: <CodeIcon />,
                                title: "Source code",
                                link: "https://gitlab.com/metahkg/metahkg",
                            },
                        ].map((item, index) => (
                            <ListItemButton
                                component={"a"}
                                key={index}
                                onClick={onClick}
                                className="!no-underline text-inherit"
                                href={item.link}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.title} />
                            </ListItemButton>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        {user && (
                            <ListItemButton
                                component={Link}
                                className="!no-underline text-inherit"
                                to={`/profile/${user?.id}`}
                                onClick={onClick}
                            >
                                <ListItemIcon>
                                    <ManageAccountsIcon />
                                </ListItemIcon>
                                <ListItemText>{user?.name}</ListItemText>
                            </ListItemButton>
                        )}
                        <ListItemButton
                            onClick={() => {
                                setOpen(false);
                                setSettingsOpen(true);
                            }}
                        >
                            <ListItemIcon>
                                <SettingsIcon />
                            </ListItemIcon>
                            <ListItemText>Settings</ListItemText>
                        </ListItemButton>
                    </List>
                    {process.env.REACT_APP_version && (
                        <Typography gutterBottom className="!ml-[5px]">
                            Metahkg Web{" "}
                            {(process.env.REACT_APP_build && (
                                <Link
                                    className="inline"
                                    href={`https://gitlab.com/metahkg/metahkg-web/-/commit/${process.env.REACT_APP_build}`}
                                >
                                    {process.env.REACT_APP_build}
                                </Link>
                            )) ||
                                process.env.REACT_APP_date}{" "}
                            (v{process.env.REACT_APP_version})
                        </Typography>
                    )}
                </Box>
            </Drawer>
        </Box>
    );
}
