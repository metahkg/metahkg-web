import "./css/menu.css";
import React, { memo, useEffect, useState } from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";
import axios, { AxiosError } from "axios";
import MenuTop from "./menu/top";
import MenuThread from "./menu/thread";
import {
  useCat,
  useId,
  useProfile,
  useSearch,
  useMenu,
  useSelected,
  useData,
} from "./MenuProvider";
import { summary } from "../lib/common";
import MenuPreload from "./menu/preload";
import queryString from "query-string";
import { useHistory, useNotification, useQuery } from "./ContextProvider";
import SearchBar from "./searchbar";
import { useNavigate } from "react-router";
/**
 * This function renders the main content of the menu
 */
function MainContent() {
  const querystring = queryString.parse(window.location.search);
  const navigate = useNavigate();
  const [category] = useCat();
  const [search] = useSearch();
  const [profile] = useProfile();
  const [selected] = useSelected();
  const [query] = useQuery();
  const [, setNotification] = useNotification();
  const [id] = useId();
  const [data, setData] = useData();
  const [page, setPage] = useState(1);
  const [end, setEnd] = useState(false);
  const [updating, setUpdating] = useState(false);
  const q = decodeURIComponent(String(querystring.q || query || ""));
  const c: string | number = category || `bytid${id}`;
  /**
   * It sets the notification state to an object with the open property set to true and the text
   * property set to the error message.
   * @param {AxiosError} err - The error object.
   */
  function onError(err: AxiosError) {
    setNotification({
      open: true,
      text: err?.response?.data?.error || err?.response?.data || "",
    });
    err?.response?.status === 404 && navigate("/404", { replace: true });
  }
  /* A way to make sure that the effect is only run once. */
  useEffect(() => {
    if (!data.length && (category || profile || search || id)) {
      const url = {
        search: `/api/search?q=${q}&sort=${selected}`,
        profile: `/api/history/${profile}?sort=${selected}`,
        menu: `/api/menu/${c}?sort=${selected}`,
      }[search ? "search" : profile ? "profile" : "menu"];
      axios
        .get(url)
        .then((res) => {
          !(page === 1) && setPage(1);
          setData(res.data);
          res.data.length < 25 && !end && setEnd(true);
          res.data.length >= 25 && end && setEnd(false);
          setUpdating(false);
        })
        .catch(onError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  /**
   * It updates the data array with the new data from the API.
   */
  function update() {
    setUpdating(true);
    const url = {
      search: `/api/search?q=${q}&sort=${selected}&page=${page + 1}`,
      profile: `/api/history/${profile}?sort=${selected}&page=${page + 1}`,
      menu: `/api/menu/${c}?sort=${selected}&page=${page + 1}`,
    }[search ? "search" : profile ? "profile" : "menu"];
    axios
      .get(url)
      .then((res) => {
        const d: any = data;
        if (res.data?.[0] !== null) {
          res.data.forEach((item: any) => {
            d.push(item);
          });
          setData(d);
        }
        res.data.length < 25 && setEnd(true);
        setPage((page) => page + 1);
        setUpdating(false);
      })
      .catch(onError);
  }
  /**
   * If the user has scrolled to the bottom of the page, update the list
   * @param {any} e - The event object.
   */
  function onScroll(e: any) {
    if (!end && !updating) {
      const diff = e.target.scrollHeight - e.target.scrollTop;
      if (
        (e.target.clientHeight >= diff - 1.5 &&
          e.target.clientHeight <= diff + 1.5) ||
        diff < e.target.clientHeight
      ) {
        update();
      }
    }
  }
  return (
    <Paper
      className="nobgimage noshadow overflow-auto"
      style={{
        maxHeight: search ? "calc(100vh - 151px)" : "calc(100vh - 91px)",
      }}
      onScroll={onScroll}
    >
      <Box
        className="min-height-full"
        sx={{
          bgcolor: "primary.main",
        }}
      >
        {!!(data.length && data?.[0] !== null) && (
          <Box className="flex flex-dir-column max-width-full menu-bottom">
            {data.map((thread: summary) => (
              <div>
                <MenuThread
                  key={`${category}${id === thread.id}`}
                  thread={thread}
                />
                <Divider />
              </div>
            ))}
            {updating && <MenuPreload />}
            {end && (
              <Typography
                className="mt10 mb10 text-align-center font-size-20-force"
                sx={{
                  color: "secondary.main",
                }}
              >
                End
              </Typography>
            )}
          </Box>
        )}
        {!data.length && <MenuPreload />}
      </Box>
    </Paper>
  );
}
function Menu() {
  const [selected, setSelected] = useSelected();
  const [, setData] = useData();
  const [menu] = useMenu();
  const [search] = useSearch();
  const [query, setQuery] = useQuery();
  const [, setHistory] = useHistory();
  const [category] = useCat();
  const [profile] = useProfile();
  const navigate = useNavigate();
  const [n, setN] = useState(Math.random());
  let tempq = decodeURIComponent(query || "");
  return (
    <Box
      className={`max-width-full min-height-fullvh flex-dir-column ${
        menu ? "flex" : "display-none"
      } menu-root`}
    >
      <MenuTop
        refresh={() => {
          setData([]);
          setN(Math.random());
        }}
        onClick={(e: number) => {
          if (selected !== e) {
            setSelected(e);
            setData([]);
          }
        }}
        selected={selected}
      />
      {search && (
        <div className="flex fullwidth">
          <div className="flex fullwidth justify-center align-center m10 menu-search">
            <SearchBar
              onChange={(e) => {
                tempq = e.target.value;
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter" && tempq) {
                  navigate(`/search?q=${encodeURIComponent(tempq)}`);
                  setQuery(tempq);
                  setData([]);
                  setHistory(`/search?q=${encodeURIComponent(tempq)}`);
                }
              }}
            />
          </div>
        </div>
      )}
      <MainContent key={`${search}${profile}${category}${selected}${n}`} />
    </Box>
  );
}
export default memo(Menu);
