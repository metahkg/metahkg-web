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
import { summary } from "../../types/conversation/summary";
import { Link } from "react-router-dom";
import { useCat, useId, useMenuMode } from "../MenuProvider";
import { useCategories, useHistory } from "../ContextProvider";

/**
 * A component that renders a thread in the menu.
 * @param {summary} props.thread thread info
 * @param {() => void | undefined} props.onClick on click event handler
 */
export default function MenuThread(props: {
    thread: summary;
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
            className="fullwidth text-decoration-none"
            to={`/thread/${thread.id}?${
                commentId && id !== thread.id ? `c=${commentId}` : "page=1"
            }`}
            onClick={onClick}
        >
            <Box
                className={`flex fullwidth flex-dir-column user-select-none menuthread-root${
                    id === thread.id ? "-selected" : ""
                }`}
            >
                <div className="flex fullwidth align-center justify-space-between menuthread-top">
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <p
                            className="font-size-16 ml20 metahkg-grey menuthread-op"
                            style={{
                                color: thread.op.sex === "M" ? "#0277bd" : "red",
                            }}
                        >
                            {thread.op.name}
                        </p>
                        <p className="ml5 nomargin metahkg-grey font-size-13 menuthread-toptext">
                            {timeToWord(thread.lastModified)}
                        </p>
                    </div>
                    <div className="flex align-center">
                        {thread.vote >= 0 ? (
                            <ThumbUpIcon className="metahkg-grey ml5 font-size-13-force menuthread-icons" />
                        ) : (
                            <ThumbDownIcon className="metahkg-grey ml5 font-size-13-force menuthread-icons" />
                        )}
                        <p className="nomargin metahkg-grey font-size-13 menuthread-toptext">
                            {thread.vote}
                        </p>
                        <CommentIcon className="metahkg-grey ml5 font-size-13-force menuthread-icons" />
                        <p className="nomargin metahkg-grey font-size-13 menuthread-toptext">
                            {thread.c}
                        </p>
                        <ArticleIcon className="metahkg-grey ml5 font-size-13-force menuthread-icons" />
                        <p className="mr10 nomargin metahkg-grey font-size-13 menuthread-toptext">
                            {String(roundup(thread.c / 25))}
                        </p>
                    </div>
                </div>
                <div className="flex fullwidth mb10 align-center justify-space-between menuthread-bottom">
                    <p className="ml20 nomargin font-size-16 overflow-hidden text-overflow-ellipsis text-align-left menuthread-title">
                        {thread.title}
                    </p>
                    {(menuMode !== "category" || cat === 1) && (
                        <Link
                            className="mr10 text-decoration-none"
                            to={`/category/${thread.category}`}
                        >
                            <Button
                                variant="contained"
                                className="nomargin nopadding text-transform-none menuthread-catbtn"
                            >
                                <p className="nomargin font-size-12 menuthread-catname">
                                    {
                                        categories.find((i) => i.id === thread.category)
                                            ?.name
                                    }
                                </p>
                            </Button>
                        </Link>
                    )}
                </div>
            </Box>
        </Link>
    );
}
