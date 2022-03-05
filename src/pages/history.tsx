import React from "react";
import { Navigate, useParams } from "react-router";
import {
  useCat,
  useId,
  useMenu,
  useProfile,
  useSearch,
  useSelected,
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
  const [id, setId] = useId();
  const [cat, setCat] = useCat();
  if (!(width < 760)) {
    return <Navigate to={`/profile/${params.id}`} replace />;
  }
  !menu && setMenu(true);
  history !== window.location.pathname && setHistory(window.location.pathname);
  (profile !== Number(params.id) || "self") &&
    setProfile(Number(params.id) || "self");
  search && setSearch(false);
  selected && setSelected(0);
  id && setId(0);
  cat && setCat(0);
  return <div />;
}
