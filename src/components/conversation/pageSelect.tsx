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

import React from "react";
import { Box, IconButton, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";

export default function PageSelect(props: {
    pages: number;
    page: number;
    last?: boolean;
    next?: boolean;
    onSelect: (e: SelectChangeEvent<number>) => void;
    onLastClicked: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onNextClicked: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) {
    const { pages, page, onSelect, onLastClicked, onNextClicked, last, next } = props;
    return (
        <Box className="absolute bottom-[60px] right-[40px] z-20 flex flex-col">
            {last && (
                <Box className="h-[40px] w-[50px] !rounded-t-[50%] bg-[#eeeeee] dark:bg-[#333] flex items-center justify-center">
                    <IconButton onClick={onLastClicked}>
                        <ArrowDropUp />
                    </IconButton>
                </Box>
            )}
            <Box
                className="cursor-pointer bg-[#eeeeee] dark:bg-[#333] h-[50px] w-[50px] flex justify-center items-center"
                sx={{ borderRadius: last || next ? "0" : "50%" }}
            >
                <Select
                    value={page}
                    label="Page"
                    onChange={onSelect}
                    color="secondary"
                    variant="standard"
                    className="[&>svg]:hidden [&>div]:!p-0 [&>div]:!flex [&>div]:!items-center [&>div]:!justify-center [&>div]:!h-full [&>div]:!w-full [&>div]:!rounded-[50%] h-full w-full !p-0 flex items-center justify-center"
                    disableUnderline
                    sx={{ borderRadius: last || next ? "0" : "50%" }}
                >
                    {[...Array(pages)].map((_p, index) => (
                        <MenuItem key={index} value={index + 1}>
                            {index + 1}
                        </MenuItem>
                    ))}
                </Select>
            </Box>
            {next && (
                <Box className="h-[40px] w-[50px] !rounded-b-[50%] bg-[#eeeeee] dark:bg-[#333] flex items-center justify-center">
                    <IconButton onClick={onNextClicked}>
                        <ArrowDropDown />
                    </IconButton>
                </Box>
            )}
        </Box>
    );
}
