import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/*
The MIT License (MIT)

Copyright (c) 2014 Call-Em-All

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
import "./css/searchbar.css";
import { Chip, InputBase, styled } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useQuery } from "./ContextProvider";
import { useData, useSearch, useSmode } from "./MenuProvider";
const Search = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "#111",
    border: `1px solid ${theme.palette.secondary.main}`,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        width: "auto",
        maxWidth: "100%",
    },
}));
const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    color: "white",
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "white",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
            width: "100%",
        },
    },
}));
/**
 * It's a search bar
 * @param props - {onKeyPress: KeyboardEventHandler; OnChange: ChangeEventHandler}
 * @returns A search bar with a search icon and an input field.
 */
export default function SearchBar(props) {
    const [query] = useQuery();
    const [, setData] = useData();
    const [smode, setSmode] = useSmode();
    const [search] = useSearch();
    return (_jsxs(Search, { children: [_jsx(SearchIconWrapper, { children: _jsx(SearchIcon, {}) }), _jsx(StyledInputBase, { placeholder: "Search", inputProps: { "aria-label": "search" }, onKeyPress: props.onKeyPress, onChange: props.onChange, defaultValue: query }), search && (_jsx(Chip, { label: smode ? "OP" : "Title", onClick: () => {
                    setSmode(Number(!smode));
                    setData([]);
                }, className: "mr10 searchbar-chip" }))] }));
}
//# sourceMappingURL=searchbar.js.map