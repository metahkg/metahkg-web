import React from "react";
import "../../css/components/menu/thread.css";
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
import { useCategories, useHistory } from "../ContextProvider";
import { ThreadMeta } from "@metahkg/api";

export default function MenuThread(props: {
    thread: ThreadMeta;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}) {
    const [cat] = useCat();
    const [id] = useId();
    const [history] = useHistory();
    const [menuMode] = useMenuMode();
    const categories = useCategories();
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
                className={`flex w-full flex-col !select-none menuthread-root${
                    id === thread.id ? "-selected" : ""
                }`}
            >
                <Box className="flex w-full items-center justify-between menuthread-top">
                    <Box style={{ display: "flex", alignItems: "center" }}>
                        <p
                            className="text-[16px] !ml-[20px] text-metahkg-grey menuthread-op"
                            style={{
                                color: thread.op.sex === "M" ? "#0277bd" : "red",
                            }}
                        >
                            {thread.op.name}
                        </p>
                        <p className="!ml-[5px] !m-0 text-metahkg-grey text-[13px] menuthread-toptext">
                            {timeToWord(thread.lastModified)}
                        </p>
                    </Box>
                    <Box className="flex items-center">
                        {thread.score >= 0 ? (
                            <ThumbUpIcon className="text-metahkg-grey !ml-[5px] !text-[13px] menuthread-icons" />
                        ) : (
                            <ThumbDownIcon className="text-metahkg-grey !ml-[5px] !text-[13px] menuthread-icons" />
                        )}
                        <p className="!m-0 text-metahkg-grey text-[13px] menuthread-toptext">
                            {thread.score}
                        </p>
                        <CommentIcon className="text-metahkg-grey !ml-[5px] !text-[13px] menuthread-icons" />
                        <p className="!m-0 text-metahkg-grey text-[13px] menuthread-toptext">
                            {thread.c}
                        </p>
                        <ArticleIcon className="text-metahkg-grey !ml-[5px] !text-[13px] menuthread-icons" />
                        <p className="!mr-[10px] !m-0 text-metahkg-grey text-[13px] menuthread-toptext">
                            {String(roundup(thread.c / 25))}
                        </p>
                    </Box>
                </Box>
                <Box className="flex w-full !mb-[10px] items-center justify-between menuthread-bottom">
                    <p className="!ml-[20px] !m-0 text-[16px] overflow-hidden text-overflow-ellipsis text-left menuthread-title">
                        {thread.title}
                    </p>
                    {(menuMode !== "category" || cat === 1) && (
                        <Link
                            className="!mr-[10px] !no-underline"
                            to={`/category/${thread.category}`}
                        >
                            <Button
                                variant="contained"
                                className="!m-0 !p-0 !normal-case menuthread-catbtn"
                            >
                                <p className="!m-0 text-[12px] menuthread-catname">
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
