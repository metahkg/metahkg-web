import "./css/top.css";
import React, { useEffect } from "react";
import {
  Add as AddIcon,
  Autorenew as AutorenewIcon,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Tab, Tabs, Tooltip } from "@mui/material";
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
import { useWidth } from "../ContextProvider";
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
  const [width] = useWidth();
  const mode =
    (search && "search") ||
    (profile && "profile") ||
    (recall && "recall") ||
    "menu";
  const inittitle = {
    search: "Search",
    profile: "User Profile",
    menu: "Metahkg",
    recall: "Recall",
  }[mode];
  const [title, setTitle] = useTitle();
  const tabs = {
    search: ["Relevance", "Topic", "Comments"],
    profile: ["Topic", "Comments"],
    menu: [width < 760 && title ? title : "Latest", "Hot"],
    recall: [],
  }[mode];
  const mobileTop = mode !== "menu";
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
        sx={{
          bgcolor: "primary.main",
          height: recall ? 50 : width < 760 && !mobileTop ? 40 : 90,
        }}
      >
        {(width < 760 ? mobileTop : 1) && (
          <div className="flex fullwidth align-center justify-space-between menutop-top">
            {!(width < 760) && (
              <div className="ml10 mr40">
                <SideBar />
              </div>
            )}
            <p className="novmargin font-size-18 user-select-none metahkg-yellow text-align-center">
              {title || inittitle}
            </p>
            {!(width < 760) && (
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
            )}
          </div>
        )}
        {tabs.length && (
          <Box className="flex fullwidth align-flex-end menutop-bottom">
            <Tabs
              className="fullwidth"
              value={props.selected}
              textColor="secondary"
              indicatorColor="secondary"
              variant="fullWidth"
              onChange={(e, v) => {
                props.onClick(v);
              }}
            >
              {tabs.map((tab, index) => (
                <Tab
                  className="font-size-15-force notexttransform"
                  value={index}
                  label={tab}
                  disableRipple
                />
              ))}
            </Tabs>
          </Box>
        )}
      </Box>
      <Divider />
    </div>
  );
}
