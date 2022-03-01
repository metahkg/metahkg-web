import React from "react";
import { Box } from "@mui/material";
import Empty from "../components/empty";
import {
  useCat,
  useData,
  useId,
  useMenu,
  useSearch,
  useSelected,
  useTitle,
} from "../components/MenuProvider";
import { useHistory, useWidth } from "../components/ContextProvider";
export default function Search() {
  const [search, setSearch] = useSearch();
  const [menu, setMenu] = useMenu();
  const [history, setHistory] = useHistory();
  const [data, setData] = useData();
  const [width] = useWidth();
  const [selected, setSelected] = useSelected();
  const [, setTitle] = useTitle();
  const [id, setId] = useId();
  const [cat, setCat] = useCat();
  document.title = "Search | Metahkg";
  history !== window.location.pathname &&
    setHistory(window.location.pathname + window.location.search);
  !menu && setMenu(true);
  id && setId(0);
  cat && setCat(0);
  if (!search) {
    setSearch(true);
    data && setData([]);
    selected && setSelected(0);
    setTitle("");
  }
  return (
    <Box
      className="flex min-height-fullvh"
      sx={{
        bgcolor: "primary.dark",
      }}
    >
      {!(width < 760) && <Empty />}
    </Box>
  );
}
