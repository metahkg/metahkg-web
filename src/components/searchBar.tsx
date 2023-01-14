/*
 Copyright (C) 2022-present Metahkg Contributors

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
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
import React, { KeyboardEventHandler } from "react";
import { Chip, InputBase, styled } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useMenuMode, useReFetch, useSmode } from "./MenuProvider";

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
export default function SearchBar(props: {
    query: string;
    onKeyPress: KeyboardEventHandler<HTMLDivElement>;
    onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}) {
    const { query, onKeyPress, onChange } = props;
    const [, setReFetch] = useReFetch();
    const [smode, setSmode] = useSmode();
    const [menuMode] = useMenuMode();

    return (
        <Search>
            <SearchIconWrapper>
                <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
                placeholder="Search"
                inputProps={{ "aria-label": "search" }}
                onKeyPress={onKeyPress}
                onChange={onChange}
                value={query}
            />
            {menuMode === "search" && (
                <Chip
                    label={smode ? "OP" : "Title"}
                    onClick={() => {
                        setSmode(Number(!smode));
                        setReFetch(true);
                    }}
                    sx={{
                        "& span": {
                            overflow: "visible !important",
                        },
                        "& .MuiTouchRipple-root": {
                            display: "none",
                        },
                    }}
                    className="!mr-[10px] !h-[24px] !min-w-[45px]"
                />
            )}
        </Search>
    );
}
