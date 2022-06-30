import React from "react";
import "./css/thread.css";
import { summary } from "../../types/conversation/summary";
/**
 * A component that renders a thread in the menu.
 * @param {summary} props.thread thread info
 * @param {() => void | undefined} props.onClick on click event handler
 */
export default function MenuThread(props: {
    thread: summary;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}): JSX.Element;
