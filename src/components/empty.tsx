import "./css/empty.css";
import React from "react";
import {
  AccountCircle as AccountCircleIcon,
  Create as CreateIcon,
  Code as CodeIcon,
  Telegram as TelegramIcon,
  ManageAccounts as ManageAccountsIcon,
} from "@mui/icons-material";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";
import MetahkgIcon from "./icon";
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
          <Link
            className="notextdecoration white"
            to={`/${
              localStorage.user ? "logout" : "signin"
            }?returnto=${encodeURIComponent(wholepath())}`}
          >
            <ListItem button className="fullwidth">
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText>
                {localStorage.user ? "logout" : "Sign in / Register"}
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
          {links.map((i) => (
            <Link className="notextdecoration white" to={i.link}>
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
