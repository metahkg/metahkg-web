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
import { Box, Button } from "@mui/material";
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
            className="w-full !no-underline"
            to={`/thread/${thread.id}?${
                commentId && id !== thread.id ? `c=${commentId}` : "page=1"
            }`}
            onClick={onClick}
        >
            <Box
                className={`flex w-full flex-col !select-none ${
                    id === thread.id ? "bg-[#292929]" : "hover:bg-[#232323]"
                }`}
            >
                <Box className="flex w-full items-center justify-between h-[35px]">
                    <Box style={{ display: "flex", alignItems: "center" }}>
                        <p
                            className="text-[16px] !ml-[20px] text-metahkg-grey"
                            style={{
                                color: thread.op.sex === "M" ? "#0277bd" : "red",
                            }}
                        >
                            {thread.op.name}
                        </p>
                        <p className="!ml-[5px] !m-0 text-metahkg-grey text-[13px]">
                            {timeToWord(thread.lastModified)}
                        </p>
                    </Box>
                    <Box className="flex items-center">
                        {thread.score >= 0 ? (
                            <ThumbUpIcon className="text-metahkg-grey !ml-[5px] !text-[13px] mr-[2px]" />
                        ) : (
                            <ThumbDownIcon className="text-metahkg-grey !ml-[5px] !text-[13px] mr-[2px]" />
                        )}
                        <p className="!m-0 text-metahkg-grey text-[13px]">
                            {thread.score}
                        </p>
                        <CommentIcon className="text-metahkg-grey !ml-[5px] !text-[13px] mr-[2px]" />
                        <p className="!m-0 text-metahkg-grey text-[13px]">
                            {thread.count}
                        </p>
                        <ArticleIcon className="text-metahkg-grey !ml-[5px] !text-[13px] mr-[2px]" />
                        <p className="!mr-[10px] !m-0 text-metahkg-grey text-[13px]">
                            {String(roundup(thread.count / 25))}
                        </p>
                    </Box>
                </Box>
                <Box className="flex w-full !mb-[10px] items-center justify-between">
                    <p className="!ml-[20px] !m-0 text-[16px] overflow-hidden text-ellipsis text-left leading-[20px] max-h-[60px] mr-[30px]">
                        {thread.title}
                    </p>
                    {(menuMode !== "category" || cat === 1) && (
                        <Link
                            className="!mr-[10px] !no-underline"
                            to={`/category/${thread.category}`}
                        >
                            <Button
                                variant="contained"
                                className="!m-0 !p-0 !normal-case !rounded-[15px] !bg-[#333] hover:!bg-[#444]"
                            >
                                <p className="!m-0 text-[12px]">
                                    {
                                        categories.find((i) => i.id === thread.category)
                                            ?.name
                                    }
                                </p>
                            </Button>
                        </Link>
                    )}
                </Box>
            </Box>
        </Link>
    );
}
