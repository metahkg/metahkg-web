import "../../css/components/conversation/pageselect.css";
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
        <Box
            className="absolute bottom-[60px] right-[40px] z-20 flex flex-col"
        >
            {last && (
                <Box className="h-[40px] w-[50px] rounded-t-1/2 bg-[#333] flex items-center justify-center">
           `1         <IconButton onClick={onLastClicked}>
                        <ArrowDropUp />
                    </IconButton>
                </Box>
            )}
            <Box
                className="pageselect-box flex justify-center items-center"
                sx={{ borderRadius: last || next ? "0" : "50%" }}
            >
                <Select
                    value={page}
                    label="Page"
                    onChange={onSelect}
                    color="secondary"
                    variant="standard"
                    className="pageselect-select !p-0 flex items-center justify-center"
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
                <Box className="pageselect-bottom flex items-center justify-center">
                    <IconButton onClick={onNextClicked}>
                        <ArrowDropDown />
                    </IconButton>
                </Box>
            )}
        </Box>
    );
}
