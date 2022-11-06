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
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useBack, useIsSmallScreen } from "../AppContextProvider";

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
            className="h-[46px] border-solid border-0 border-b-[1px] border-[#3b3b3b]"
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
                        className={`!my-0 !ml-[10px] overflow-hidden text-ellipsis whitespace-nowrap !text-[18px] leading-[24px] max-h-[24px] ${
                            isSmallScreen ? "text-center" : ""
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
