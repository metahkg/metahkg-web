import "./css/title.css";
import React from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useBack, useWidth } from "../ContextProvider";

/**
 * It's a component that renders the title of the thread.
 * @param {number} props.category The category of the thread
 * @param {string} props.title The title of of the thread
 * @param {string} props.slink The shortened link of the thread
 */
export default function Title(props: {
    /** thread category id */
    category: number | undefined;
    /** thread title */
    title: string | undefined;
    /** buttons */
    btns: { icon: JSX.Element; useAction: () => void; title: string }[];
}) {
    const { category, title, btns } = props;
    const [history] = useBack();
    const [width] = useWidth();
    return (
        <Box
            className="title-root"
            sx={{
                bgcolor: "primary.main",
            }}
        >
            <div className="flex ml10 mr20 align-center justify-space-between fullheight">
                <div className="flex align-center mr10 overflow-hidden">
                    {(history || category) && (
                        <Link to={history || `/category/${category}`}>
                            <IconButton className="nomargin nopadding">
                                <ArrowBackIcon color="secondary" />
                            </IconButton>
                        </Link>
                    )}
                    <Typography
                        className={`novmargin ml10 overflow-hidden text-overflow-ellipsis nowrap font-size-18-force title-text${
                            width < 760 ? " text-align-center" : ""
                        }`}
                        sx={{
                            color: "secondary.main",
                        }}
                    >
                        {title}
                    </Typography>
                </div>
                <div className="flex">
                    {!(width < 760) &&
                        btns.map((btn, index) => (
                            <Tooltip key={index} arrow title={btn.title}>
                                <IconButton onClick={btn.useAction}>
                                    {btn.icon}
                                </IconButton>
                            </Tooltip>
                        ))}
                </div>
            </div>
        </Box>
    );
}
