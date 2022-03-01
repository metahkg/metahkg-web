import React, { createContext, useContext, useState } from "react";
const MenuContext = createContext<any>({});
/*
 * Provide global values for controlling the menu
 */
export default function MenuProvider(props: { children: JSX.Element }) {
  const [category, setCategory] = useState(0);
  const [id, setId] = useState(0);
  const [profile, setProfile] = useState<number | "self">(0);
  const [search, useSearch] = useState(false);
  const [menu, setMenu] = useState(false);
  const [selected, setSelected] = useState(0);
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  return (
    <MenuContext.Provider
      value={{
        category: [category, setCategory],
        id: [id, setId],
        search: [search, useSearch],
        profile: [profile, setProfile],
        menu: [menu, setMenu],
        selected: [selected, setSelected],
        data: [data, setData],
        title: [title, setTitle],
      }}
    >
      {props.children}
    </MenuContext.Provider>
  );
}
export function useCat(): [
  number,
  React.Dispatch<React.SetStateAction<number>>
] {
  const { category } = useContext(MenuContext);
  return category;
}
export function useId(): [
  number,
  React.Dispatch<React.SetStateAction<number>>
] {
  const { id } = useContext(MenuContext);
  return id;
}
export function useSearch(): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>
] {
  const { search } = useContext(MenuContext);
  return search;
}
export function useProfile(): [
  number | "self",
  React.Dispatch<React.SetStateAction<number | "self">>
] {
  const { profile } = useContext(MenuContext);
  return profile;
}
export function useMenu(): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>
] {
  const { menu } = useContext(MenuContext);
  return menu;
}
export function useSelected(): [
  number,
  React.Dispatch<React.SetStateAction<number>>
] {
  const { selected } = useContext(MenuContext);
  return selected;
}
export function useData(): [
  any[],
  React.Dispatch<React.SetStateAction<any[]>>
] {
  const { data } = useContext(MenuContext);
  return data;
}
export function useTitle(): [
  string,
  React.Dispatch<React.SetStateAction<string>>
] {
  const { title } = useContext(MenuContext);
  return title;
}
