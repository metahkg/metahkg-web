import "./css/pagetop.css";
import React from "react";
import { SelectChangeEvent } from "@mui/material";
export default function PageTop(props: {
    pages: number;
    page: number;
    onChange: (e: SelectChangeEvent<number>) => void;
    last?: boolean;
    next?: boolean;
    onLastClicked?: React.MouseEventHandler<HTMLSpanElement>;
    onNextClicked?: React.MouseEventHandler<HTMLSpanElement>;
    id?: number | string;
}): JSX.Element;
