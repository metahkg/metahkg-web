import "./css/pageselect.css";
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
        <div className="pageselect-root flex flex-dir-column">
            {last && (
                <Box className="pageselect-top flex align-center justify-center">
                    <IconButton onClick={onLastClicked}>
                        <ArrowDropUp />
                    </IconButton>
                </Box>
            )}
            <Box
                className="pageselect-box flex justify-center align-center"
                sx={{ borderRadius: last || next ? "0" : "50%" }}
            >
                <Select
                    value={page}
                    label="Age"
                    onChange={onSelect}
                    color="secondary"
                    variant="standard"
                    className="pageselect-select nopadding flex align-center justify-center"
                    disableUnderline
                >
                    {[...Array(pages)].map((p, index) => (
                        <MenuItem key={index} value={index + 1}>
                            {index + 1}
                        </MenuItem>
                    ))}
                </Select>
            </Box>
            {next && (
                <Box className="pageselect-bottom flex align-center justify-center">
                    <IconButton onClick={onNextClicked}>
                        <ArrowDropDown />
                    </IconButton>
                </Box>
            )}
        </div>
    );
}
