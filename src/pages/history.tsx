import React from "react";
import { Navigate, useParams } from "react-router";
import {
  useCat,
  useId,
  useMenu,
  useProfile,
  useSearch,
  useSelected,
  useTitle,
  useData
} from "../components/MenuProvider";
import { useHistory, useWidth } from "../components/ContextProvider";
/**
 * Only for small screens
 * Controls the menu to show ProfileMenu
 * @returns a div element
 */
export default function History() {
  const params = useParams();
  const [profile, setProfile] = useProfile();
  const [search, setSearch] = useSearch();
  const [menu, setMenu] = useMenu();
  const [history, setHistory] = useHistory();
  const [width] = useWidth();
  const [selected, setSelected] = useSelected();
  const [, setTitle] = useTitle();
  const [,setData] = useData();
  const [id, setId] = useId();
  const [cat, setCat] = useCat();
  if (!(width < 760)) {
    return <Navigate to={`/profile/${params.id}`} replace />;
  }
  function cleardata() {
    setData([]);
    setTitle("");
    selected && setSelected(0);
  }
  !menu && setMenu(true);
  history !== window.location.pathname && setHistory(window.location.pathname);
  if (profile !== (Number(params.id) || "self")) {
    setProfile(Number(params.id) || "self");
    cleardata();
  }
  if (search) {
    setSearch(false);
    cleardata();
  }
  id && setId(0);
  cat && setCat(0);
  return <div />;
}
