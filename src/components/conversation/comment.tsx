import "../../css/components/conversation/comment.css";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Typography, SxProps, Theme, CircularProgress } from "@mui/material";
import { useBlockList, useNotification } from "../ContextProvider";
import VoteButtons from "./comment/votebuttons";
import { useThreadId, useVotes } from "./ConversationContext";
import CommentTop from "./comment/commentTop";
import CommentBody from "./comment/commentBody";
import { api } from "../../lib/api";
import {
    EscalatorOutlined,
    Forum,
    KeyboardArrowDown,
    KeyboardArrowUp,
} from "@mui/icons-material";
import CommentPopup from "../../lib/commentPopup";
import { parseError } from "../../lib/parseError";
import { Comment as CommentType } from "@metahkg/api";

/**
 * Comment component renders a comment
 * which includes a title (Tag)
 * the comment body
 * and upvote and downvote buttons
 */
export default function Comment(props: {
    comment: CommentType;
    noId?: boolean;
    inPopUp?: boolean;
    showReplies?: boolean;
    fetchComment?: boolean;
    noQuote?: boolean;
    setIsExpanded?: React.Dispatch<React.SetStateAction<boolean>>;
    fold?: boolean;
    openComment?: boolean;
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
        openComment,
        sx,
        className,
        maxHeight,
        noFullWidth,
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
            setReFetch(true);
        }
    }, [votes?.[comment.id], prevVote, votes, comment.id]);

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
            <Box
                className={`${noFullWidth ? "" : "fullwidth"} ${className || ""}`}
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
                        openComment
                    />
                )}
                <Box
                    className={`text-align-left ${
                        !inPopUp ? "mt6" : showReplies ? "" : "overflow-auto"
                    } fullwidth comment-root`}
                    sx={(theme) => ({
                        "& *::selection": {
                            background: theme.palette.secondary.main,
                            color: "black",
                        },
                        bgcolor: "primary.main",
                        maxHeight: inPopUp && !showReplies ? "90vh" : "",
                    })}
                >
                    <Box className="ml20 mr20">
                        <CommentTop
                            comment={comment}
                            noStory={noStory}
                            fold={fold}
                            setFold={setFold}
                            blocked={blocked}
                            setBlocked={setBlocked}
                        />
                        {!fold && !blocked && (
                            <React.Fragment>
                                <CommentBody
                                    maxHeight={maxHeight}
                                    noQuote={noQuote}
                                    comment={comment}
                                    depth={0}
                                />
                                <Box className="comment-internal-spacer" />
                            </React.Fragment>
                        )}
                    </Box>
                    {ready && !fold && !blocked && (
                        <Box className="flex justify-space-between align-center fullwidth">
                            <Box className="flex ml20 mr20">
                                <VoteButtons
                                    comment={comment}
                                    key={`${comment.U}${comment.D}`}
                                />
                                {!inPopUp && comment.replies?.length && (
                                    <Button
                                        sx={{
                                            minWidth: "0 !important",
                                            bgcolor: "#333 !important",
                                        }}
                                        className="br5 nomargin ml10 metahkg-grey-force nopadding mt0 mb0 pl10 pr10 pt3 pb3"
                                        variant="text"
                                        onClick={() => {
                                            setPopupOpen(true);
                                        }}
                                    >
                                        <Forum
                                            sx={{
                                                "&:hover": {
                                                    color: "white",
                                                },
                                            }}
                                            className="font-size-14-force"
                                        />
                                        <p className="ml5 novmargin metahkg-grey">
                                            {comment.replies?.length}
                                        </p>
                                    </Button>
                                )}
                            </Box>
                            {openComment && (
                                <a
                                    href={`/thread/${threadId}?c=${comment.id}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex metahkg-grey-force mr10 notextdecoration"
                                >
                                    <EscalatorOutlined />
                                    Open Comment
                                </a>
                            )}
                        </Box>
                    )}
                    <Box className="comment-spacer" />
                </Box>
                {loading && (
                    <Box className="flex justify-center align-center">
                        <CircularProgress
                            size={30}
                            className="mt10 mb5"
                            color={"secondary"}
                        />
                    </Box>
                )}
                {!!replies.length && (
                    <Box>
                        <Box
                            className="flex align-center justify-center text-align-center pointer"
                            onClick={() => {
                                setShowReplies(!showReplies);
                                setIsExpanded && setIsExpanded(!showReplies);
                            }}
                        >
                            <Typography className="mt5 mb5" color="secondary">
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
                                        openComment
                                    />
                                ))}
                                <Box className="flex justify-center align-center">
                                    <Typography
                                        className="mt5 mb5 font-size-18-force"
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
        ),
        [
            className,
            comment,
            fold,
            inPopUp,
            blocked,
            loading,
            maxHeight,
            noFullWidth,
            noId,
            noQuote,
            noStory,
            openComment,
            popupOpen,
            ready,
            replies,
            setIsExpanded,
            showReplies,
            sx,
            threadId,
        ]
    );
}
