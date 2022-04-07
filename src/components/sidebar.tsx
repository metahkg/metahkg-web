import "./css/sidebar.css";
import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  Drawer,
  Divider,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle as AccountCircleIcon,
  Telegram as TelegramIcon,
  Code as CodeIcon,
  ManageAccounts as ManageAccountsIcon,
  Logout as LogoutIcon,
  AccessTimeFilled,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import SearchBar from "./searchbar";
import { useQuery, useSettingsOpen } from "./ContextProvider";
import { categories, wholepath } from "../lib/common";
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
                    navigate(`/search?q=${encodeURIComponent(tempq)}`);
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
                title: localStorage.user ? "Logout" : "Sign in / Register",
                link: `/${
                  localStorage.user ? "logout" : "signin"
                }?returnto=${encodeURIComponent(wholepath())}`,
                icon: localStorage.user ? (
                  <LogoutIcon />
                ) : (
                  <AccountCircleIcon />
                ),
              },
            ].map((item) => (
              <Link to={item.link} className="notextdecoration white">
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
            (cats: { id: number; name: string; hidden?: boolean }[], index) => (
              <div>
                {cats && (
                  <div
                    className={`m20${
                      localStorage.user && !index ? " mb10" : ""
                    }${index ? " mt0" : ""}`}
                  >
                    {cats.map((category) => (
                      <Link
                        className="font-size-16 sidebar-catlink notextdecoration text-align-left halfwidth"
                        to={`/category/${category.id}`}
                        style={{
                          color:
                            cat === category.id && !(profile || search)
                              ? "#fbc308"
                              : "white",
                        }}
                        onClick={onClick}
                      >
                        {category.name}
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
              <a className="notextdecoration white" href={item.link}>
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
            Metahkg build {process.env.REACT_APP_build || "v0.5.8rc2"}
          </p>
        </Box>
      </Drawer>
    </div>
  );
}
