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
  Create as CreateIcon,
  Telegram as TelegramIcon,
  Code as CodeIcon,
  ManageAccounts as ManageAccountsIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import SearchBar from "./searchbar";
import { useQuery } from "./ContextProvider";
import { categories, wholepath } from "../lib/common";
import { useCat, useData, useProfile, useSearch } from "./MenuProvider";
import MetahkgLogo from "./icon";
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
              <Link to="/" className="notextdecoration white">
                <ListItem button onClick={onClick}>
                  <ListItemIcon>
                    <MetahkgLogo height={24} width={24} svg light />
                  </ListItemIcon>
                  <ListItemText>Metahkg</ListItemText>
                </ListItem>
              </Link>
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
            <Link
              className="notextdecoration white"
              to={`/${
                localStorage.user ? "logout" : "signin"
              }?returnto=${encodeURIComponent(wholepath())}`}
            >
              <ListItem button onClick={onClick}>
                <ListItemIcon>
                  <AccountCircleIcon />
                </ListItemIcon>
                <ListItemText>
                  {localStorage.user ? "Logout" : "Sign in / Register"}
                </ListItemText>
              </ListItem>
            </Link>
            <Link className="notextdecoration white" to="/create">
              <ListItem button onClick={onClick}>
                <ListItemIcon>
                  <CreateIcon />
                </ListItemIcon>
                <ListItemText>Create topic</ListItemText>
              </ListItem>
            </Link>
          </List>
          <Divider />
          <div className="m20">
            {Object.entries(categories).map((category: any) => (
              <Link
                className="font-size-16 sidebar-catlink notextdecoration text-align-left halfwidth"
                to={`/category/${category[0]}`}
                style={{
                  color:
                    cat === Number(category[0]) && !(profile || search)
                      ? "#fbc308"
                      : "white",
                }}
                onClick={onClick}
              >
                {category[1]}
              </Link>
            ))}
          </div>
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
          {localStorage.user && (
            <div>
              <List>
                <Link to="/profile/self" className="notextdecoration white">
                  <ListItem button onClick={onClick}>
                    <ListItemIcon>
                      <ManageAccountsIcon />
                    </ListItemIcon>
                    <ListItemText>{localStorage.user}</ListItemText>
                  </ListItem>
                </Link>
              </List>
              <Divider />
            </div>
          )}
          <p className="ml5">
            Metahkg build {process.env.REACT_APP_build || "v0.5.5rc3"}
          </p>
        </Box>
      </Drawer>
    </div>
  );
}
