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
} from "@mui/material";
import { Link } from "../lib/link";
import MetahkgIcon from "./logo";
import MetahkgLogo from "./logo";
import { wholePath } from "../lib/common";
import { useUser } from "./ContextProvider";

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
    return (
        <Paper
            className="overflow-auto justify-center flex max-h-screen"
            sx={{
                bgcolor: "primary.dark",
                width: "70vw",
            }}
        >
            <Box className="w-full m50">
                <Box className="flex items-center">
                    <MetahkgIcon height={40} width={50} svg light />
                    <h1>Metahkg</h1>
                </Box>
                <List>
                    <ListItemButton
                        className="w-full !no-underline text-white"
                        component={"a"}
                        href="https://war.ukraine.ua/support-ukraine/"
                    >
                        <ListItemIcon>
                            <MetahkgLogo ua height={24} width={30} />
                        </ListItemIcon>
                        <ListItemText>Support Ukraine</ListItemText>
                    </ListItemButton>
                    <ListItemButton
                        component={Link}
                        className="!no-underline text-white w-full"
                        to={`/${
                            user ? "users/logout" : "users/login"
                        }?returnto=${encodeURIComponent(wholePath())}`}
                    >
                        <ListItemIcon>
                            {user ? <LogoutIcon /> : <AccountCircleIcon />}
                        </ListItemIcon>
                        <ListItemText>
                            {user ? "Logout" : "Login / Register"}
                        </ListItemText>
                    </ListItemButton>
                    {user && (
                        <ListItemButton
                            component={Link}
                            to={`/profile/${user?.id}`}
                            className="w-full !no-underline text-white"
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
                            to={link.link}
                            className="w-full !no-underline text-white"
                        >
                            <ListItemIcon>{link.icon}</ListItemIcon>
                            <ListItemText>{link.title}</ListItemText>
                        </ListItemButton>
                    ))}
                </List>
            </Box>
        </Paper>
    );
}
