import React from "react";
import { createContext, useContext, useState } from "react";
const Context = createContext<any>({});
/*
 * allows components to access and change variables "history" and "width"
 * width is used to rerender the app to fit device size
 * history is used for the thread arrow
 */
export default function ContextProvider(props: { children: JSX.Element }) {
  const [history, setHistory] = useState("");
  const [query, setQuery] = useState("");
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [notification, setNotification] = useState({ open: false, text: "" });
  function updateSize() {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  }
  window.addEventListener("resize", updateSize);
  return (
    <Context.Provider
      value={{
        history: [history, setHistory],
        width: [width, setWidth],
        query: [query, setQuery],
        height: [height, setHeight],
        notification: [notification, setNotification],
      }}
    >
      {props.children}
    </Context.Provider>
  );
}
export function useHistory(): [
  string,
  React.Dispatch<React.SetStateAction<string>>
] {
  const { history } = useContext(Context);
  return history;
}
export function useWidth(): [
  number,
  React.Dispatch<React.SetStateAction<number>>
] {
  const { width } = useContext(Context);
  return width;
}
export function useQuery(): [
  string,
  React.Dispatch<React.SetStateAction<string>>
] {
  const { query } = useContext(Context);
  return query;
}
export function useHeight(): [
  number,
  React.Dispatch<React.SetStateAction<number>>
] {
  const { height } = useContext(Context);
  return height;
}
export function useNotification(): [
  { open: boolean; text: string },
  React.Dispatch<React.SetStateAction<{ open: boolean; text: string }>>
] {
  const { notification } = useContext(Context);
  return notification;
}
