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

import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { Box, Typography, SxProps, Theme, CircularProgress } from "@mui/material";
import { useBlockList, useNotification } from "../AppContextProvider";
import { useThreadId, useVotes } from "./ConversationContext";
import CommentTop from "./comment/commentTop";
import CommentBody from "./comment/commentBody";
import { api } from "../../lib/api";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import CommentPopup from "../../lib/commentPopup";
import { parseError } from "../../lib/parseError";
import { Comment as CommentType } from "@metahkg/api";
import CommentBottom from "./comment/commentBottom";
import CommentEdit from "./comment/commentEdit";
import { Link } from "../../lib/link";

const CommentContext = createContext<{
    comment: [CommentType, React.Dispatch<React.SetStateAction<CommentType>>];
    reFetch: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    showReplies: [
        boolean | undefined,
        React.Dispatch<React.SetStateAction<boolean | undefined>>
    ];
    replies: [CommentType[], React.Dispatch<React.SetStateAction<CommentType[]>>];
    popupOpen: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    fold: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    blocked: [
        boolean | undefined,
        React.Dispatch<React.SetStateAction<boolean | undefined>>
    ];
    /** admin edit mode */
    editing: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    commentRef: React.RefObject<HTMLElement>;
    inPopUp?: boolean;
    inREplies?: boolean;
    inThread?: boolean;
    setIsExpanded?: React.Dispatch<React.SetStateAction<boolean>>;
    // @ts-ignore
}>({});

export default function Comment(props: {
    comment: CommentType;
    noId?: boolean;
    inPopUp?: boolean;
    inReplies?: boolean;
    inThread?: boolean;
    showReplies?: boolean;
    fetchComment?: boolean;
    noQuote?: boolean;
    setIsExpanded?: React.Dispatch<React.SetStateAction<boolean>>;
    fold?: boolean;
    blocked?: boolean;
    noStory?: boolean;
    scrollIntoView?: boolean;
    className?: string;
    sx?: SxProps<Theme>;
    maxHeight?: string | number;
    noFullWidth?: boolean;
}) {
    const {
        noId,
        scrollIntoView,
        fetchComment,
        inPopUp,
        noQuote,
        setIsExpanded,
        noStory,
        sx,
        className,
        maxHeight,
        noFullWidth,
        inReplies: inReply,
        inThread,
    } = props;
    const threadId = useThreadId();
    const [comment, setComment] = useState(props.comment);
    const [votes] = useVotes();
    const [, setNotification] = useNotification();
    const [blockList] = useBlockList();
    const [ready, setReady] = useState(!fetchComment);
    const [reFetch, setReFetch] = useState(false);
    const [showReplies, setShowReplies] = useState(props.showReplies);
    const [replies, setReplies] = useState<CommentType[]>([]);
    const [loading, setLoading] = useState(false);
    const [popupOpen, setPopupOpen] = useState(false);
    const [fold, setFold] = useState(Boolean(props.fold));
    const [editing, setEditing] = useState(false);
    const commentRef = useRef<HTMLElement>(null);
    const prevVote = useRef(votes?.find((vote) => vote.cid === comment.id)?.vote);

    const [blocked, setBlocked] = useState<boolean | undefined>(
        Boolean(blockList.find((i) => i.id === comment.user.id)) || undefined
    );

    useEffect(() => {
        (blocked || blocked === undefined) &&
            setBlocked(
                Boolean(blockList.find((i) => i.id === comment.user.id)) || undefined
            );
    }, [blockList, blocked, comment.user.id]);

    useEffect(() => {
        const currentVote = votes?.find((vote) => vote.cid === comment.id)?.vote;
        if (prevVote.current !== currentVote && currentVote) {
            prevVote.current = currentVote;
            api.commentVotes(threadId, comment.id).then((data) =>
                setComment((comment) => ({ ...comment, ...data }))
            );
        }
    }, [prevVote, votes, comment.id, threadId]);

    useEffect(() => {
        commentRef.current && scrollIntoView && commentRef.current.scrollIntoView();
        if (!ready || reFetch) {
            setReFetch(false);
            api.comment(threadId, comment.id)
                .then((data) => {
                    setComment(data);
                    setReady(true);
                })
                .catch((err) => {
                    setNotification({
                        open: true,
                        severity: "error",
                        text: parseError(err),
                    });
                });
        }
        if (inPopUp) {
            setLoading(true);
            api.commentReplies(threadId, comment.id)
                .then((data) => {
                    setReplies(data);
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ready, reFetch]);

    return useMemo(
        () => (
            <CommentContext.Provider
                value={{
                    comment: [comment, setComment],
                    reFetch: [reFetch, setReFetch],
                    showReplies: [showReplies, setShowReplies],
                    replies: [replies, setReplies],
                    popupOpen: [popupOpen, setPopupOpen],
                    fold: [fold, setFold],
                    blocked: [blocked, setBlocked],
                    editing: [editing, setEditing],
                    inPopUp,
                    commentRef,
                    setIsExpanded,
                    inREplies: inReply,
                    inThread,
                }}
            >
                <Box className="flex flex-col">
                    <Box
                        className={`${noFullWidth ? "" : "w-[calc(100%-8px)]"} mx-1 ${
                            className || ""
                        }`}
                        sx={sx}
                        ref={commentRef}
                        id={noId ? undefined : `c${comment.id}`}
                    >
                        {comment.replies?.length && (
                            <CommentPopup
                                comment={comment}
                                showReplies
                                open={popupOpen}
                                setOpen={setPopupOpen}
                            />
                        )}
                        <Box
                            className={`text-left !my-1 ${
                                showReplies ? "" : "overflow-auto"
                            } w-full rounded-md`}
                            sx={(theme) => ({
                                "& *::selection": {
                                    background: theme.palette.secondary.main,
                                    color: "black",
                                },
                                bgcolor: "primary.main",
                                maxHeight: inPopUp && !showReplies ? "90vh" : "",
                            })}
                        >
                            <Box className="!mx-5">
                                <CommentTop comment={comment} noStory={noStory} />
                                {!fold && !blocked && (
                                    <React.Fragment>
                                        {editing ? (
                                            <CommentEdit />
                                        ) : (
                                            <CommentBody
                                                maxHeight={maxHeight}
                                                noQuote={noQuote}
                                                comment={comment}
                                                depth={0}
                                            />
                                        )}
                                    </React.Fragment>
                                )}
                            </Box>
                            {ready && !fold && !blocked && <CommentBottom />}
                            <Box className="h-4" />
                        </Box>

                        {inThread && (
                            <React.Fragment>
                                {comment.admin?.replies?.map((reply) => {
                                    return (
                                        <Typography className="!m-2">
                                            <Typography
                                                className="inline"
                                                sx={{ color: "secondary.main" }}
                                            >
                                                Admin{" "}
                                                <Link
                                                    color="inherit"
                                                    href={`/profile/${reply.admin.id}`}
                                                >
                                                    {reply.admin.name}
                                                </Link>{" "}
                                                #{reply.admin.id} replied on{" "}
                                                {reply.date
                                                    ? new Date(reply.date)
                                                          .toISOString()
                                                          .split("T")[0]
                                                    : "unknown"}
                                                :{" "}
                                            </Typography>
                                            {reply.reply}
                                        </Typography>
                                    );
                                })}
                                {comment.admin?.edits?.map((edit) => {
                                    return (
                                        <Typography className="!m-2">
                                            <Typography
                                                className="inline"
                                                sx={{ color: "secondary.main" }}
                                            >
                                                Admin{" "}
                                                <Link
                                                    color="inherit"
                                                    href={`/profile/${edit.admin.id}`}
                                                >
                                                    {edit.admin.name}
                                                </Link>{" "}
                                                #{edit.admin.id} edited on{" "}
                                                {edit.date
                                                    ? new Date(edit.date)
                                                          .toISOString()
                                                          .split("T")[0]
                                                    : "unknown"}
                                                :{" "}
                                            </Typography>
                                            {edit.reason}
                                        </Typography>
                                    );
                                })}
                            </React.Fragment>
                        )}
                        {loading && (
                            <Box className="flex justify-center items-center">
                                <CircularProgress
                                    size={30}
                                    className="!mt-2 !mb-1"
                                    color={"secondary"}
                                />
                            </Box>
                        )}
                        {Boolean(replies.length) && (
                            <Box>
                                <Box
                                    className="flex items-center justify-center text-center cursor-pointer"
                                    onClick={() => {
                                        setShowReplies(!showReplies);
                                        setIsExpanded?.(!showReplies);
                                    }}
                                >
                                    <Typography className="!mt-1 !mb-1" color="secondary">
                                        {showReplies ? "Hide" : "Show"} Replies
                                    </Typography>
                                    {showReplies ? (
                                        <KeyboardArrowUp color="secondary" />
                                    ) : (
                                        <KeyboardArrowDown color="secondary" />
                                    )}
                                </Box>
                                {showReplies && (
                                    <React.Fragment>
                                        {replies.map((comment) => (
                                            <Comment
                                                comment={comment}
                                                noId
                                                noQuote
                                                noStory
                                                inReplies
                                            />
                                        ))}
                                        <Box className="flex justify-center items-center">
                                            <Typography
                                                className="!mt-1 !mb-1 !text-lg"
                                                color="secondary"
                                            >
                                                End
                                            </Typography>
                                        </Box>
                                    </React.Fragment>
                                )}
                            </Box>
                        )}
                    </Box>
                </Box>
            </CommentContext.Provider>
        ),
        [
            comment,
            reFetch,
            showReplies,
            replies,
            popupOpen,
            fold,
            blocked,
            editing,
            inPopUp,
            setIsExpanded,
            inReply,
            inThread,
            noFullWidth,
            className,
            sx,
            noId,
            noStory,
            maxHeight,
            noQuote,
            ready,
            loading,
        ]
    );
}

export function useComment() {
    const { comment } = useContext(CommentContext);
    return comment;
}

export function useReFetch() {
    const { reFetch } = useContext(CommentContext);
    return reFetch;
}

export function useShowReplies() {
    const { showReplies } = useContext(CommentContext);
    return showReplies;
}

export function useReplies() {
    const { replies } = useContext(CommentContext);
    return replies;
}

export function usePopupOpen() {
    const { popupOpen } = useContext(CommentContext);
    return popupOpen;
}

export function useFold() {
    const { fold } = useContext(CommentContext);
    return fold;
}

export function useBlocked() {
    const { blocked } = useContext(CommentContext);
    return blocked;
}

export function useEditing() {
    const { editing } = useContext(CommentContext);
    return editing;
}

export function useCommentRef() {
    const { commentRef } = useContext(CommentContext);
    return commentRef;
}

export function useInPopUp() {
    const { inPopUp } = useContext(CommentContext);
    return inPopUp;
}

export function useInReply() {
    const { inREplies: inReply } = useContext(CommentContext);
    return inReply;
}

export function useInThread() {
    const { inThread } = useContext(CommentContext);
    return inThread;
}

export function useSetIsExpanded() {
    const { setIsExpanded } = useContext(CommentContext);
    return setIsExpanded;
}
