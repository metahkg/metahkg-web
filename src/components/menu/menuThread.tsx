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
import { Box, Button, Typography } from "@mui/material";
import {
    Article as ArticleIcon,
    Comment as CommentIcon,
    ThumbDown as ThumbDownIcon,
    ThumbUp as ThumbUpIcon,
} from "@mui/icons-material";
import { roundup, timeToWord } from "../../lib/common";
import { Link } from "react-router-dom";
import { useCat, useId, useMenuMode } from "../MenuProvider";
import { useCategories, useHistory } from "../AppContextProvider";
import { ThreadMeta } from "@metahkg/api";

export default function MenuThread(props: {
    thread: ThreadMeta;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}) {
    const [cat] = useCat();
    const [id] = useId();
    const [history] = useHistory();
    const [menuMode] = useMenuMode();
    const [categories] = useCategories();
    const { thread, onClick } = props;
    const commentId = history.find((i) => i.id === thread.id)?.cid;

    return (
        <Link
            className="w-full !no-underline !text-inherit"
            to={`/thread/${thread.id}?${
                commentId && id !== thread.id ? `c=${commentId}` : "page=1"
            }`}
            onClick={onClick}
        >
            <Box
                className={`flex w-full flex-col !select-none ${
                    id === thread.id
                        ? "bg-[#f6f6f6] dark:bg-[#292929]"
                        : "hover:bg-[#f3f3f3] dark:hover:bg-[#232323]"
                }`}
            >
                <Box className="flex w-full items-center justify-between h-9">
                    <Box style={{ display: "flex", alignItems: "center" }}>
                        <Typography
                            variant="subtitle1"
                            component="p"
                            className={`!ml-5 ${
                                thread.op.sex === "M" ? "text-[#0277bd]" : "text-[red]"
                            }`}
                        >
                            {thread.op.name}
                        </Typography>
                        <Typography variant="body2" className="!ml-1 text-metahkg-grey">
                            {timeToWord(thread.lastModified)}
                        </Typography>
                    </Box>
                    <Box className="flex items-center">
                        {thread.score >= 0 ? (
                            <ThumbUpIcon
                                fontSize="inherit"
                                className="text-metahkg-grey mx-1 text-xs"
                            />
                        ) : (
                            <ThumbDownIcon
                                fontSize="inherit"
                                className="text-metahkg-grey mx-1 text-xs"
                            />
                        )}
                        <Typography variant="body2" className="text-metahkg-grey">
                            {thread.score}
                        </Typography>
                        <CommentIcon
                            fontSize="inherit"
                            className="text-metahkg-grey mx-1 text-xs"
                        />
                        <Typography variant="body2" className="text-metahkg-grey">
                            {thread.count}
                        </Typography>
                        <ArticleIcon
                            fontSize="inherit"
                            className="text-metahkg-grey mx-1 text-xs"
                        />
                        <Typography variant="body2" className="!mr-2 text-metahkg-grey">
                            {String(roundup(thread.count / 25))}
                        </Typography>
                    </Box>
                </Box>
                <Box className="flex w-full mb-2 items-center justify-between">
                    <Typography className="!ml-5 !mr-7 overflow-hidden text-ellipsis text-left !leading-5 max-h-[60px]">
                        {thread.title}
                    </Typography>
                    {(menuMode !== "category" || cat === 1) && (
                        <Link
                            className="!mr-[10px] !no-underline !text-inherit"
                            to={`/category/${thread.category}`}
                        >
                            <Button
                                variant="contained"
                                className="!m-0 !p-[3px] !normal-case !rounded-2xl !bg-[#f3f3f3] hover:!bg-[#f6f6f6] dark:!bg-[#333] dark:hover:!bg-[#444]"
                            >
                                <Typography
                                    variant="body2"
                                    className="!mx-1 !whitespace-nowrap"
                                >
                                    {
                                        categories.find((i) => i.id === thread.category)
                                            ?.name
                                    }
                                </Typography>
                            </Button>
                        </Link>
                    )}
                </Box>
            </Box>
        </Link>
    );
}
