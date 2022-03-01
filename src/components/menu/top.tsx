import "./css/top.css";
import React, { useEffect } from "react";
import {
  Add as AddIcon,
  Autorenew as AutorenewIcon,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Tooltip, Typography } from "@mui/material";
import { MouseEventHandler } from "react";
import { Link } from "react-router-dom";
import SideBar from "../sidebar";
import {
  useCat,
  useId,
  useProfile,
  useSearch,
  useTitle,
} from "../MenuProvider";
import axios from "axios";
/*
 * The top part of the menu consists of a title part
 * (sidebar, title, refresh and create topic button link)
 * and a buttons part (normally two to three buttons)
 * which serve as tabs to decide the data fetch location
 */
export default function MenuTop(props: {
  refresh: MouseEventHandler<HTMLButtonElement>;
  selected: number;
  onClick: (e: number) => void;
}) {
  const [search] = useSearch();
  const [profile] = useProfile();
  const [category] = useCat();
  const [id] = useId();
  const inittitle = {
    search: "Search",
    profile: "User Profile",
    menu: "Metahkg",
  }[search ? "search" : profile ? "profile" : "menu"];
  const [title, setTitle] = useTitle();
  const tabs = {
    search: ["Relevance", "Created", "Last Comment"],
    profile: ["Created", "Last Comment"],
    menu: ["Newest", "Hottest"],
  }[search ? "search" : profile ? "profile" : "menu"];
  useEffect(() => {
    if (!search && !title && (category || profile || id)) {
      if (profile) {
        axios.get(`/api/profile/${profile}?nameonly=true`).then((res) => {
          setTitle(res.data.user);
          document.title = `${res.data.user} | Metahkg`;
        });
      } else {
        axios.get(`/api/category/${category || `bytid${id}`}`).then((res) => {
          setTitle(res.data.name);
          if (!id) {
            document.title = `${res.data.name} | Metahkg`;
          }
        });
      }
    }
  }, [category, id, profile, search, setTitle, title]);
  return (
    <div>
      <Box
        className="fullwidth menutop-root"
        sx={{ backgroundColor: "primary.main" }}
      >
        <div className="flex fullwidth align-center justify-space-between menutop-top">
          <div className="ml10 menutop-sidebar-btn">
            <SideBar />
          </div>
          <p className="novmargin menutop-title">{title || inittitle}</p>
          <div className="flex">
            <Tooltip title="Refresh" arrow>
              <IconButton onClick={props.refresh}>
                <AutorenewIcon className="force-white" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Create topic" arrow>
              <Link className="flex" to="/create">
                <IconButton className="mr10">
                  <AddIcon className="force-white" />
                </IconButton>
              </Link>
            </Tooltip>
          </div>
        </div>
        <div className="flex fullwidth align-flex-end menutop-bottom">
          {tabs.map((tab, index) => (
            <Box
              onClick={() => {
                props.onClick(index);
              }}
              className={`pointer fullwidth mr10 flex justify-center align-center fullheight${
                !index ? " ml10" : ""
              }`}
              sx={{
                borderBottom:
                  props.selected === index ? "2px solid rgb(245, 189, 31)" : "",
              }}
            >
              <Typography
                className="menutop-tabtext"
                sx={{ color: "secondary.main" }}
              >
                {tab}
              </Typography>
            </Box>
          ))}
        </div>
      </Box>
      <Divider />
    </div>
  );
}
