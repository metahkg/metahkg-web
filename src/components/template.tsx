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

import React from "react";
import {
    AccountCircle as AccountCircleIcon,
    Code as CodeIcon,
    Create as CreateIcon,
    Logout as LogoutIcon,
    ManageAccounts as ManageAccountsIcon,
    Telegram as TelegramIcon,
} from "@mui/icons-material";
import {
    Box,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Typography,
} from "@mui/material";
import { Link } from "../lib/link";
import MetahkgIcon from "./logo";
import MetahkgLogo from "./logo";
import { wholePath } from "../lib/common";
import { useDarkMode, useUser } from "./AppContextProvider";
import { useLogout } from "../hooks/useLogout";

/**
 * just a template for large screens if there's no content
 * e.g. /category/:id, in which there's no main content but only the menu
 */
export default function Template() {
    /* It's a list of objects. */
    const links: { icon: JSX.Element; title: string; link: string }[] = [
        {
            icon: <CreateIcon />,
            title: "Create thread",
            link: "/create",
        },
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
    ];

    const [user] = useUser();
    const darkMode = useDarkMode();
    const logout = useLogout();

    return (
        <Paper
            className="overflow-auto justify-center flex h-screen w-full"
            sx={{
                bgcolor: "primary.dark",
            }}
        >
            <Box className="w-full m-10">
                <Box className="flex items-center my-5">
                    <MetahkgIcon height={50} width={50} svg light={darkMode} />
                    <Typography variant="h4" component="h1" className="!ml-1">
                        Metahkg
                    </Typography>
                </Box>
                <List>
                    <Link
                        className="w-full !no-underline !text-inherit"
                        href="https://war.ukraine.ua/support-ukraine/"
                    >
                        <ListItemButton>
                            <ListItemIcon>
                                <MetahkgLogo ua height={24} width={30} />
                            </ListItemIcon>
                            <ListItemText>Support Ukraine</ListItemText>
                        </ListItemButton>
                    </Link>

                    {user ? (
                        <ListItemButton onClick={logout} className="!text-inherit w-full">
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText>Logout</ListItemText>
                        </ListItemButton>
                    ) : (
                        <Link
                            href={`/users/login?returnto=${encodeURIComponent(
                                wholePath()
                            )}`}
                            className="!no-underline !text-inherit w-full"
                        >
                            <ListItemButton>
                                <ListItemIcon>
                                    <AccountCircleIcon />
                                </ListItemIcon>
                                <ListItemText>Login / Register</ListItemText>
                            </ListItemButton>
                        </Link>
                    )}

                    {user && (
                        <Link
                            href={`/profile/${user?.id}`}
                            className="w-full !no-underline !text-inherit"
                        >
                            <ListItemButton>
                                <ListItemIcon>
                                    <ManageAccountsIcon />
                                </ListItemIcon>
                                <ListItemText>{user?.name}</ListItemText>
                            </ListItemButton>
                        </Link>
                    )}

                    {links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.link}
                            className="w-full !no-underline !text-inherit"
                        >
                            <ListItemButton>
                                <ListItemIcon>{link.icon}</ListItemIcon>
                                <ListItemText>{link.title}</ListItemText>
                            </ListItemButton>
                        </Link>
                    ))}
                </List>
            </Box>
        </Paper>
    );
}
