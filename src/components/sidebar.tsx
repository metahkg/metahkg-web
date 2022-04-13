import "./css/sidebar.css";
import React, { useState } from "react";
import {
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
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
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import SearchBar from "./searchbar";
import { useCategories, useQuery, useSettingsOpen } from "./ContextProvider";
import { wholepath } from "../lib/common";
import { useCat, useData, useProfile, useSearch } from "./MenuProvider";
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
    const [profile] = useProfile();
    const [search] = useSearch();
    const [, setSettingsOpen] = useSettingsOpen();
    const categories = useCategories();
    const navigate = useNavigate();
    const toggleDrawer =
        (o: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
            if (
                event.type === "keydown" &&
                ((event as React.KeyboardEvent).key === "Tab" ||
                    (event as React.KeyboardEvent).key === "Shift")
            ) {
                return;
            }
            setOpen(o);
        };

    function onClick() {
        setOpen(false);
    }

    const [data, setData] = useData();
    let tempq = decodeURIComponent(query || "");
    return (
        <div>
            <div>
                <IconButton className="sidebar-menu-btn" onClick={toggleDrawer(true)}>
                    <MenuIcon className="force-white" />
                </IconButton>
            </div>
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
                <Box className="sidebar-box max-width-full" role="presentation">
                    <div className="fullwidth">
                        <List className="fullwidth">
                            <a
                                href="https://war.ukraine.ua/support-ukraine/"
                                className="notextdecoration white"
                            >
                                <ListItem button onClick={onClick}>
                                    <ListItemIcon>
                                        <MetahkgLogo height={24} width={30} ua />
                                    </ListItemIcon>
                                    <ListItemText>Support Ukraine</ListItemText>
                                </ListItem>
                            </a>
                        </List>
                        <div className="ml10 mr10">
                            <SearchBar
                                onChange={(e) => {
                                    tempq = e.target.value;
                                }}
                                onKeyPress={(e: any) => {
                                    if (e.key === "Enter" && tempq) {
                                        navigate(
                                            `/search?q=${encodeURIComponent(tempq)}`
                                        );
                                        data && setData([]);
                                        setOpen(false);
                                        setQuery(tempq);
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <List>
                        {[
                            {
                                title: "Recall",
                                link: "/recall",
                                icon: <AccessTimeFilled />,
                            },
                            {
                                title: localStorage.user
                                    ? "Logout"
                                    : "Sign in / Register",
                                link: `/${
                                    localStorage.user ? "users/logout" : "users/signin"
                                }?returnto=${encodeURIComponent(wholepath())}`,
                                icon: localStorage.user ? (
                                    <LogoutIcon />
                                ) : (
                                    <AccountCircleIcon />
                                ),
                            },
                        ].map((item, index) => (
                            <Link
                                key={index}
                                to={item.link}
                                className="notextdecoration white"
                            >
                                <ListItem button onClick={onClick}>
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText>{item.title}</ListItemText>
                                </ListItem>
                            </Link>
                        ))}
                    </List>
                    <Divider />
                    {[
                        categories.filter((i) => !i.hidden),
                        localStorage.user && categories.filter((i) => i.hidden),
                    ].map(
                        (
                            cats: { id: number; name: string; hidden?: boolean }[],
                            index
                        ) => (
                            <div key={index}>
                                {cats && (
                                    <div
                                        className={`m20${
                                            localStorage.user && !index ? " mb10" : ""
                                        }${index ? " mt0" : ""}`}
                                    >
                                        {cats.map((category, index) => (
                                            <Link
                                                key={index}
                                                to={`/category/${category.id}`}
                                                className="notextdecoration"
                                            >
                                                <Typography
                                                    className="font-size-16-force text-align-left mt5 mb5 halfwidth sidebar-catlink"
                                                    sx={(theme) => ({
                                                        color:
                                                            cat === category.id &&
                                                            !(profile || search)
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
                                    </div>
                                )}
                            </div>
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
                            <a
                                key={index}
                                className="notextdecoration white"
                                href={item.link}
                            >
                                <ListItem button key={index} onClick={onClick}>
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.title} />
                                </ListItem>
                            </a>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        {localStorage.user && (
                            <Link to="/profile/self" className="notextdecoration white">
                                <ListItem button onClick={onClick}>
                                    <ListItemIcon>
                                        <ManageAccountsIcon />
                                    </ListItemIcon>
                                    <ListItemText>{localStorage.user}</ListItemText>
                                </ListItem>
                            </Link>
                        )}
                        <ListItem
                            button
                            onClick={() => {
                                setOpen(false);
                                setSettingsOpen(true);
                            }}
                        >
                            <ListItemIcon>
                                <SettingsIcon />
                            </ListItemIcon>
                            <ListItemText>Settings</ListItemText>
                        </ListItem>
                    </List>
                    <p className="ml5">
                        Metahkg build {process.env.REACT_APP_build || "v0.5.9rc2"}
                    </p>
                </Box>
            </Drawer>
        </div>
    );
}
