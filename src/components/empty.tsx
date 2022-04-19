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
import { Link } from "react-router-dom";
import MetahkgIcon from "./logo";
import MetahkgLogo from "./logo";
import { wholepath } from "../lib/common";

/**
 * just a template for large screens if there's no content
 * e.g. /category/:id, in which there's no main content but only the menu
 */
export default function Empty() {
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
            link: "/telegram",
        },
        {
            icon: <CodeIcon />,
            title: "Source code",
            link: "/source",
        },
    ];
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
                            localStorage.user ? "users/logout" : "users/signin"
                        }?returnto=${encodeURIComponent(wholepath())}`}
                    >
                        <ListItem button className="fullwidth">
                            <ListItemIcon>
                                {localStorage.user ? (
                                    <LogoutIcon />
                                ) : (
                                    <AccountCircleIcon />
                                )}
                            </ListItemIcon>
                            <ListItemText>
                                {localStorage.user ? "Logout" : "Sign in / Register"}
                            </ListItemText>
                        </ListItem>
                    </Link>
                    {localStorage.user && (
                        <Link to="/profile/self" className="notextdecoration white">
                            <ListItem button className="fullwidth">
                                <ListItemIcon>
                                    <ManageAccountsIcon />
                                </ListItemIcon>
                                <ListItemText>{localStorage.user}</ListItemText>
                            </ListItem>
                        </Link>
                    )}
                    {links.map((i, index) => (
                        <Link className="notextdecoration white" to={i.link} key={index}>
                            <ListItem button className="fullwidth">
                                <ListItemIcon>{i.icon}</ListItemIcon>
                                <ListItemText>{i.title}</ListItemText>
                            </ListItem>
                        </Link>
                    ))}
                </List>
            </div>
        </Paper>
    );
}
