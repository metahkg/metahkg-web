import "./css/top.css";
import { MouseEventHandler } from "react";
/**
 * The top part of the menu consists of a title part
 * (sidebar, title, refresh and create thread button link)
 * and a buttons part (normally two to three buttons)
 * which serve as tabs to decide the data fetch location
 * @param {MouseEventHandler<HTMLButtonElement>} props.refresh event handler for when refresh is clicked
 * @param {number} props.selected selected tab number
 * @param {(e: number) => void} props.onClick event handler for when a tab is selected
 */
export default function MenuTop(props: {
    /** event handler when refresh is clicked */
    refresh: MouseEventHandler<HTMLButtonElement>;
    /** selected tab number*/
    selected: number;
    /** event handler for when a tab is selected */
    onClick: (e: number) => void;
}): JSX.Element;
