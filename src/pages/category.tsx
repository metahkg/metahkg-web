import React from "react";
import { Box } from "@mui/material";
import { useParams } from "react-router";
import Empty from "../components/empty";
import { useBack, useWidth } from "../components/ContextProvider";
import {
  useCat,
  useData,
  useId,
  useMenu,
  useProfile,
  useRecall,
  useSearch,
  useSelected,
  useTitle,
} from "../components/MenuProvider";
import { categories } from "../lib/common";

/**
 * It's a function that
 * returns a component that renders a box with a background color
 * @returns The empty component is being returned.
 */
export default function Category() {
  const params = useParams();
  const [id, setId] = useId();
  const [menu, setMenu] = useMenu();
  const [category, setCategory] = useCat();
  const [search, setSearch] = useSearch();
  const [profile, setProfile] = useProfile();
  const [back, setBack] = useBack();
  const [recall, setRecall] = useRecall();
  const [, setData] = useData();
  const [width] = useWidth();
  const [, setTitle] = useTitle();
  const [selected, setSelected] = useSelected();
  document.title = categories.find((i) => i.id === category)?.name + " | Metahkg";

  function cleardata() {
    setData([]);
    setTitle("");
    setSelected(0);
  }

  back !== window.location.pathname && setBack(window.location.pathname);
  !menu && setMenu(true);
  (category !== Number(params.category) || search || profile || recall) && cleardata();
  category !== Number(params.category) && setCategory(Number(params.category));
  id && setId(0);
  search && setSearch(false);
  recall && setRecall(false);
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
