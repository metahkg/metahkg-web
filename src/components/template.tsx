import "./css/empty.css";
import React from "react";
import {
    AccountCircle as AccountCircleIcon,
    Code as CodeIcon,
    Create as CreateIcon,
    Logout as LogoutIcon,
    ManageAccounts as ManageAccountsIcon,
    Telegram as TelegramIcon,
} from "@mui/icons-material";
import { List, ListItem, ListItemIcon, ListItemText, Paper } from "@mui/material";
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
            title: "Create topic",
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
            className="overflow-auto justify-center flex empty-paper"
            sx={{
                bgcolor: "parmary.dark",
            }}
        >
            <div className="fullwidth empty-main-div">
                <div className="flex align-center">
                    <MetahkgIcon height={40} width={50} svg light />
                    <h1>Metahkg</h1>
                </div>
                <List>
                    <a
                        className="notextdecoration white"
                        href="https://war.ukraine.ua/support-ukraine/"
                    >
                        <ListItem button className="fullwidth">
                            <ListItemIcon>
                                <MetahkgLogo ua height={24} width={30} />
                            </ListItemIcon>
                            <ListItemText>Support Ukraine</ListItemText>
                        </ListItem>
                    </a>
                    <Link
                        className="notextdecoration white"
                        to={`/${
                            user ? "users/logout" : "users/signin"
                        }?returnto=${encodeURIComponent(wholePath())}`}
                    >
                        <ListItem button className="fullwidth">
                            <ListItemIcon>
                                {user ? <LogoutIcon /> : <AccountCircleIcon />}
                            </ListItemIcon>
                            <ListItemText>
                                {user ? "Logout" : "Sign in / Register"}
                            </ListItemText>
                        </ListItem>
                    </Link>
                    {user && (
                        <Link to="/profile/self" className="notextdecoration white">
                            <ListItem button className="fullwidth">
                                <ListItemIcon>
                                    <ManageAccountsIcon />
                                </ListItemIcon>
                                <ListItemText>{user.name}</ListItemText>
                            </ListItem>
                        </Link>
                    )}

                    {links.map((link, index) => (
                        <Link
                            className="notextdecoration white"
                            to={link.link}
                            key={index}
                        >
                            <ListItem button className="fullwidth">
                                <ListItemIcon>{link.icon}</ListItemIcon>
                                <ListItemText>{link.title}</ListItemText>
                            </ListItem>
                        </Link>
                    ))}
                </List>
            </div>
        </Paper>
    );
}
