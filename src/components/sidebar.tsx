import "../css/components/sidebar.css";
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
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SearchBar from "./searchbar";
import { useCategories, useQuery, useSettingsOpen, useUser } from "./ContextProvider";
import { wholePath } from "../lib/common";
import { useCat, useProfile, useSearch } from "./MenuProvider";
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
    const [user] = useUser();
    const categories = useCategories();
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
                            <ListItemButton
                                onClick={onClick}
                                component={"a"}
                                href="https://war.ukraine.ua/support-ukraine/"
                                className="text-decoration-none white"
                            >
                                <ListItemIcon>
                                    <MetahkgLogo height={24} width={30} ua />
                                </ListItemIcon>
                                <ListItemText>Support Ukraine</ListItemText>
                            </ListItemButton>
                        </List>
                        <div className="ml10 mr10">
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
                                title: user ? "Logout" : "Login / Register",
                                link: `/users/${
                                    user ? "logout" : "login"
                                }?returnto=${encodeURIComponent(wholePath())}`,
                                icon: user ? <LogoutIcon /> : <AccountCircleIcon />,
                            },
                        ].map((item, index) => (
                            <ListItemButton
                                key={index}
                                component={Link}
                                onClick={onClick}
                                to={item.link}
                                className="text-decoration-none white"
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText>{item.title}</ListItemText>
                            </ListItemButton>
                        ))}
                    </List>
                    <Divider />
                    {[
                        categories.filter((i) => !i.hidden),
                        user && categories.filter((i) => i.hidden),
                    ].map(
                        (cats, index) =>
                            cats && (
                                <div key={index}>
                                    <div
                                        className={`m20${user && !index ? " mb10" : ""}${
                                            index ? " mt0" : ""
                                        }`}
                                    >
                                        {cats.map((category, index) => (
                                            <Link
                                                key={index}
                                                to={`/category/${category.id}`}
                                                className="notextdecoration"
                                            >
                                                <Typography
                                                    className="font-size-16-force text-align-left halfwidth sidebar-catlink"
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
                            <ListItemButton
                                component={"a"}
                                key={index}
                                onClick={onClick}
                                className="text-decoration-none white"
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
                                className="text-decoration-none white"
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
                        <p className="ml5">
                            Metahkg Web{" "}
                            {process.env.REACT_APP_build && (
                                <a
                                    style={{ display: "inline" }}
                                    href={`https://gitlab.com/metahkg/metahkg-web/-/commit/${process.env.REACT_APP_build}`}
                                >
                                    {process.env.REACT_APP_build}
                                </a>
                            )}{" "}
                            (v{process.env.REACT_APP_version})
                        </p>
                    )}
                </Box>
            </Drawer>
        </div>
    );
}
