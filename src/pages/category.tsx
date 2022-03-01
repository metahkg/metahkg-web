import React from "react";
import { Box } from "@mui/material";
import { useParams } from "react-router";
import Empty from "../components/empty";
import { useHistory, useWidth } from "../components/ContextProvider";
import {
  useCat,
  useData,
  useId,
  useMenu,
  useProfile,
  useSearch,
  useSelected,
  useTitle,
} from "../components/MenuProvider";
import { categories } from "../lib/common";
/*
 * Component for /category/1
 * returns a box with template if width > 760
 * controls the menu component
 */
export default function Category() {
  const params = useParams();
  const [id, setId] = useId();
  const [menu, setMenu] = useMenu();
  const [category, setCategory] = useCat();
  const [search, setSearch] = useSearch();
  const [profile, setProfile] = useProfile();
  const [history, setHistory] = useHistory();
  const [, setData] = useData();
  const [width] = useWidth();
  const [, setTitle] = useTitle();
  const [selected, setSelected] = useSelected();
  document.title = categories[category] + " | Metahkg";
  function cleardata() {
    setData([]);
    setTitle("");
    setSelected(0);
  }
  history !== window.location.pathname && setHistory(window.location.pathname);
  !menu && setMenu(true);
  (category !== Number(params.category) || search || profile) && cleardata();
  category !== Number(params.category) && setCategory(Number(params.category));
  id && setId(0);
  search && setSearch(false);
  profile && setProfile(0);
  ![0, 1].includes(selected) && setSelected(0);
  return (
    <Box
      className="flex"
      sx={{
        backgroundColor: "primary.dark",
      }}
    >
      {!(width < 760) && <Empty />}
    </Box>
  );
}
