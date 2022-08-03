import "../../css/components/conversation/title.css";
import React from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useBack, useIsSmallScreen } from "../ContextProvider";

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
    btns: { icon: JSX.Element; action: () => void; title: string }[];
}) {
    const { category, title, btns } = props;
    const [history] = useBack();
    const isSmallScreen = useIsSmallScreen();
    return (
        <Box
            className="title-root"
            sx={{
                bgcolor: "primary.main",
            }}
        >
            <Box className="flex !ml-[10px] !mr-[20px] items-center justify-between h-full">
                <Box className="flex items-center !mr-[10px] overflow-hidden">
                    {(history || category) && (
                        <Link to={history || `/category/${category}`}>
                            <IconButton className="!m-0 !p-0">
                                <ArrowBackIcon color="secondary" />
                            </IconButton>
                        </Link>
                    )}
                    <Typography
                        className={`!my-0 !ml-[10px] overflow-hidden text-ellipsis whitespace-nowrap !text-[18px] title-text${
                            isSmallScreen ? " text-center" : ""
                        }`}
                        sx={{
                            color: "secondary.main",
                        }}
                    >
                        {title}
                    </Typography>
                </Box>
                <Box className="flex">
                    {!isSmallScreen &&
                        btns.map((btn, index) => (
                            <Tooltip key={index} arrow title={btn.title}>
                                <IconButton onClick={btn.action}>{btn.icon}</IconButton>
                            </Tooltip>
                        ))}
                </Box>
            </Box>
        </Box>
    );
}
