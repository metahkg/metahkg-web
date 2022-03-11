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
  useRecall,
  useSearch,
  useTitle,
} from "../MenuProvider";
import axios from "axios";
/**
 * The top part of the menu consists of a title part
 * (sidebar, title, refresh and create topic button link)
 * and a buttons part (normally two to three buttons)
 * which serve as tabs to decide the data fetch location
 * @param {MouseEventHandler<HTMLButtonElement>} props.refresh event handler for when refresh is clicked
 * @param {number} props.selected selected tab number
 * @param {(e: number) => void} props.onClick event handler for when a tab is selected
 */
export default function MenuTop(props: {
  /** event handler when refresh is clicked */
  refresh: MouseEventHandler<HTMLButtonElement>;
  /** selected tab number*/
  selected: number;
  /** event handler for when a tab is selected */
  onClick: (e: number) => void;
}) {
  const [search] = useSearch();
  const [profile] = useProfile();
  const [category] = useCat();
  const [recall] = useRecall();
  const [id] = useId();
  const mode =
    (search && "search") ||
    (profile && "profile") ||
    (recall && "recall") ||
    "menu";
  const inittitle = {
    search: "Search",
    profile: "User Profile",
    menu: "Metahkg",
    recall: "Recall"
  }[mode];
  const [title, setTitle] = useTitle();
  const tabs = {
    search: ["Relevance", "Created", "Last Comment"],
    profile: ["Created", "Last Comment"],
    menu: ["Newest", "Hottest"],
    recall: []
  }[mode];
  useEffect(() => {
    if (!search && !recall && !title && (category || profile || id)) {
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
  }, [category, id, profile, recall, search, setTitle, title]);
  return (
    <div>
      <Box
        className="fullwidth menutop-root"
        sx={{ bgcolor: "primary.main", height: recall ? 50 : 90 }}
      >
        <div className="flex fullwidth align-center justify-space-between menutop-top">
          <div className="ml10 mr40">
            <SideBar />
          </div>
          <p className="novmargin font-size-18 user-select-none metahkg-yellow">
            {title || inittitle}
          </p>
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
        {tabs.length && <div className="flex fullwidth align-flex-end font-size-20 menutop-bottom">
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
                className="font-size-15-force"
                sx={{ color: "secondary.main" }}
              >
                {tab}
              </Typography>
            </Box>
          ))}
        </div>}
      </Box>
      <Divider />
    </div>
  );
}
