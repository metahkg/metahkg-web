import React from "react";
import { Box } from "@mui/material";
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

/**
 * It's a function that
 * returns a component that renders a box with a background color
 * @returns The empty component is being returned.
 */
export default function Recall() {
  const [id, setId] = useId();
  const [menu, setMenu] = useMenu();
  const [category, setCategory] = useCat();
  const [search, setSearch] = useSearch();
  const [profile, setProfile] = useProfile();
  const [back, setBack] = useBack();
  const [recall, setRecall] = useRecall();
  const [data, setData] = useData();
  const [width] = useWidth();
  const [title, setTitle] = useTitle();
  const [selected, setSelected] = useSelected();
  document.title = "Recall | Metahkg";

  function cleardata() {
    data.length && setData([]);
    title && setTitle("");
    selected && setSelected(0);
  }

  back !== window.location.pathname && setBack(window.location.pathname);
  !menu && setMenu(true);
  (category || search || profile || !recall) && cleardata();
  id && setId(0);
  category && setCategory(0);
  search && setSearch(false);
  profile && setProfile(0);
  !recall && setRecall(true);
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
