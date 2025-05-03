/*
 Copyright (C) 2022-present Wong Chun Yat (wcyat)

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

import React, { useMemo } from "react";
import {
    AccountCircle as AccountCircleIcon,
    AdminPanelSettings,
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
import { wholePath } from "../lib/common";
import { useDarkMode, useServerConfig, useUser } from "./AppContextProvider";
import { useLogout } from "../hooks/useLogout";
import { memo } from "react";
import { useTranslation } from "react-i18next";

/**
 * just a template for large screens if there's no content
 * e.g. /category/:id, in which there's no main content but only the menu
 */
const Template = memo(function Template() {
    const { t } = useTranslation();
    const [user] = useUser();
    /* It's a list of objects. */
    const links = useMemo(
        () =>
            [
                user?.role === "admin" && {
                    icon: <AdminPanelSettings />,
                    title: t("template.admin_dashboard"),
                    link: "/dashboard",
                },
                {
                    icon: <CreateIcon />,
                    title: t("template.create_thread"),
                    link: "/create",
                },
                {
                    icon: <TelegramIcon />,
                    title: t("template.telegram_group"),
                    link: "https://t.me/+WbB7PyRovUY1ZDFl",
                },
                {
                    icon: <CodeIcon />,
                    title: t("template.source_code"),
                    link: "https://gitlab.com/metahkg/metahkg",
                },
            ].filter(Boolean) as {
                icon: React.JSX.Element;
                title: string;
                link: string;
            }[],
        [user?.role, t]
    );

    const darkMode = useDarkMode();
    const logout = useLogout();
    const [serverConfig] = useServerConfig();

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
                        {serverConfig?.branding || "Metahkg"}
                    </Typography>
                </Box>
                <List>
                    <ListItemButton
                        {...(!user
                            ? {
                                  component: Link,
                                  href: `/users/login?returnto=${encodeURIComponent(
                                      wholePath()
                                  )}`,
                              }
                            : {
                                  onClick: () => {
                                      logout();
                                  },
                              })}
                        className="!no-underline !text-inherit w-full"
                    >
                        <ListItemIcon>
                            {user ? <LogoutIcon /> : <AccountCircleIcon />}
                        </ListItemIcon>
                        <ListItemText>
                            {user ? t("template.logout") : t("template.login_register")}
                        </ListItemText>
                    </ListItemButton>
                    {user && (
                        <ListItemButton
                            component={Link}
                            href={`/profile/${user?.id}`}
                            className="w-full !no-underline !text-inherit"
                        >
                            <ListItemIcon>
                                <ManageAccountsIcon />
                            </ListItemIcon>
                            <ListItemText>{user?.name}</ListItemText>
                        </ListItemButton>
                    )}

                    {links.map((link, index) => (
                        <ListItemButton
                            key={index}
                            component={Link}
                            href={link.link}
                            className="w-full !no-underline !text-inherit"
                        >
                            <ListItemIcon>{link.icon}</ListItemIcon>
                            <ListItemText>{link.title}</ListItemText>
                        </ListItemButton>
                    ))}
                </List>
            </Box>
        </Paper>
    );
});
export default Template;
