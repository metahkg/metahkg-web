import "./css/pagetop.css";
import React from "react";
import { Box, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";

export default function PageTop(props: { pages: number; page: number; onChange: (e: SelectChangeEvent<number>) => void; last?: boolean; next?: boolean; onLastClicked?: React.MouseEventHandler<HTMLSpanElement>; onNextClicked?: React.MouseEventHandler<HTMLSpanElement>; id?: number | string }) {
    const { pages, page, onChange, last, next, onLastClicked, onNextClicked, id } = props;
    return (
        <Box className="flex justify-space-between align-center ml30 mr30 pagetop-root" id={String(id)}>
            <Typography className={last ? "pointer" : "user-select-none transparent"} sx={last ? { color: "secondary.main" } : {}} onClick={last ? onLastClicked : () => {}}>
                Last Page
            </Typography>
            <Select value={page} label="Age" onChange={onChange} color="secondary" variant="standard">
                {[...Array(pages)].map((p, index) => (
                    <MenuItem key={index} value={index + 1}>
                        Page {index + 1}
                    </MenuItem>
                ))}
            </Select>
            <Typography className={next ? "pointer" : "user-select-none transparent"} sx={next ? { color: "secondary.main" } : {}} onClick={next ? onNextClicked : () => {}}>
                Next Page
            </Typography>
        </Box>
    );
}
