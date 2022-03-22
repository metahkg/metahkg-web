import React, { useRef } from "react";
import { createContext, useContext, useState } from "react";
const Context = createContext<any>({});
/**
 * Holds global application values.
 * @param props - { children: JSX.Element }
 * @returns The ContextProvider is returning a JSX element.
 */
export default function ContextProvider(props: { children: JSX.Element }) {
  const [history, setHistory] = useState("");
  const [query, setQuery] = useState("");
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [notification, setNotification] = useState({ open: false, text: "" });
  const [dock, setDock] = useState(false);
  const resizehandler = useRef(false);
  function updateSize() {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  }
  if (!resizehandler.current) {
    resizehandler.current = true;
    window.addEventListener("resize", updateSize);
  }
  return (
    <Context.Provider
      value={{
        history: [history, setHistory],
        width: [width, setWidth],
        query: [query, setQuery],
        height: [height, setHeight],
        notification: [notification, setNotification],
        dock: [dock, setDock],
      }}
    >
      {props.children}
    </Context.Provider>
  );
}
/**
 * It returns the current history and a setter for the history
 * @returns The history object and a setter function.
 */
export function useHistory(): [
  string,
  React.Dispatch<React.SetStateAction<string>>
] {
  const { history } = useContext(Context);
  return history;
}
/**
 * "Use the width of the window."
 *
 * The function returns a tuple of two values:
 *
 * The width of the window
 * A setter function for the width of the window
 *
 * The first value is the width of the window. The second value is a setter function for the width of
 * the window
 * @returns The width of the window and a setter for the width of the window.
 */
export function useWidth(): [
  number,
  React.Dispatch<React.SetStateAction<number>>
] {
  const { width } = useContext(Context);
  return width;
}
/**
 * It returns a tuple of the last search query and a setter function for the query
 * @returns A tuple of two values. The first value is the query, and the second value is a
 * setter function for the query.
 */
export function useQuery(): [
  string,
  React.Dispatch<React.SetStateAction<string>>
] {
  const { query } = useContext(Context);
  return query;
}
/**
 * "Use the height value from the Context."
 *
 * The function returns a tuple of two values:
 *
 * The height value from the Context.
 * A setter function for the height value in the Context
 * @returns The height of the window and a setter for the height of the window.
 */
export function useHeight(): [
  number,
  React.Dispatch<React.SetStateAction<number>>
] {
  const { height } = useContext(Context);
  return height;
}
/**
 * It returns a tuple of two values. The first value is an object that represents the state of the
 * notification. The second value is a function that sets the state of the notification
 * @returns A tuple of two values. The first value is the current state of the notification. The second
 * value is a function that can be used to update the state of the notification.
 */
export function useNotification(): [
  { open: boolean; text: string },
  React.Dispatch<React.SetStateAction<{ open: boolean; text: string }>>
] {
  const { notification } = useContext(Context);
  return notification;
}
/**
 * It returns a boolean (whether the dock is open) and a function that can be used to set the boolean.
 * @returns A boolean and a function that sets the boolean.
 */
export function useDock(): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>
] {
  const { dock } = useContext(Context);
  return dock;
}
