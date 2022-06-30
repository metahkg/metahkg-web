import "./css/searchbar.css";
import React, { KeyboardEventHandler } from "react";
/**
 * It's a search bar
 * @param props - {onKeyPress: KeyboardEventHandler; OnChange: ChangeEventHandler}
 * @returns A search bar with a search icon and an input field.
 */
export default function SearchBar(props: {
    onKeyPress: KeyboardEventHandler<HTMLDivElement>;
    onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}): JSX.Element;
