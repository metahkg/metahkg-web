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
import { Box, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";

export default function PageTop(props: {
    pages: number;
    page: number;
    onChange: (e: SelectChangeEvent<number>) => void;
    last?: boolean;
    next?: boolean;
    onLastClicked?: React.MouseEventHandler<HTMLSpanElement>;
    onNextClicked?: React.MouseEventHandler<HTMLSpanElement>;
    id?: number | string;
}) {
    const { pages, page, onChange, last, next, onLastClicked, onNextClicked, id } = props;
    return (
        <Box className="flex justify-between items-center !mx-7 h-[68px]" id={String(id)}>
            <Typography
                className={last ? "cursor-pointer" : "!select-none text-transparent"}
                sx={last ? { color: "secondary.main" } : {}}
                onClick={last ? onLastClicked : () => {}}
            >
                Last Page
            </Typography>
            <Select
                value={page}
                label="Age"
                onChange={onChange}
                color="secondary"
                variant="standard"
            >
                {[...Array(pages)].map((p, index) => (
                    <MenuItem key={index} value={index + 1}>
                        Page {index + 1}
                    </MenuItem>
                ))}
            </Select>
            <Typography
                className={next ? "cursor-pointer" : "!select-none text-transparent"}
                sx={next ? { color: "secondary.main" } : {}}
                onClick={next ? onNextClicked : () => {}}
            >
                Next Page
            </Typography>
        </Box>
    );
}
