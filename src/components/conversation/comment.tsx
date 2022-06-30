import "../../css/components/conversation/comment.css";
import React, { memo, useEffect, useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import VoteBar from "./comment/VoteBar";
import { useNotification, useSettings } from "../ContextProvider";
import VoteButtons from "./comment/votebuttons";
import { useThreadId } from "./ConversationContext";
import { commentType } from "../../types/conversation/comment";
import CommentTop from "./comment/commentTop";
import CommentBody from "./comment/commentBody";
import { api } from "../../lib/api";
import {
    EscalatorOutlined,
    Forum,
    KeyboardArrowDown,
    KeyboardArrowUp,
} from "@mui/icons-material";
import Spinner from "react-spinner-material";
import CommentPopup from "../../lib/commentPopup";
import { parseError } from "../../lib/parseError";

/**
 * Comment component renders a comment
 * which includes a title (Tag)
 * the comment body
 * and upvote and downvote buttons
 */
function Comment(props: {
    comment: commentType;
    noId?: boolean;
    inPopUp?: boolean;
    showReplies?: boolean;
    fetchComment?: boolean;
    noQuote?: boolean;
    setIsExpanded?: React.Dispatch<React.SetStateAction<boolean>>;
    // TODO: Some more options for the comment component
    fold?: boolean;
    openComment?: boolean;
    blocked?: boolean;
    noStory?: boolean;
    scrollIntoView?: boolean;
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
    } = props;
    const threadId = useThreadId();
    const [settings] = useSettings();
    const [comment, setComment] = useState(props.comment);
    const [, setNotification] = useNotification();
    const [ready, setReady] = useState(!fetchComment);
    const [showReplies, setShowReplies] = useState(props.showReplies);
    const [replies, setReplies] = useState<commentType[]>([]);
    const [loading, setLoading] = useState(false);
    const [popupOpen, setPopupOpen] = useState(false);
    const [fold, setFold] = useState(props.fold);
    const commentRef = useRef<HTMLElement>(null);

    useEffect(() => {
        commentRef.current && scrollIntoView && commentRef.current.scrollIntoView();
        if (fetchComment) {
            api.threads.comments
                .get({ threadId, commentId: comment.id })
                .then((res) => {
                    setComment(res.data);
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
            api.threads.comments
                .replies({ threadId, commentId: comment.id })
                .then((res) => {
                    setReplies(res.data);
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Box
            className={`fullwidth ${fold ? "pointer" : ""}`}
            onClick={() => {
                fold && setFold(false);
            }}
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
                <div className="ml20 mr20">
                    <CommentTop comment={comment} noStory={noStory} fold={fold} />
                    {!fold && (
                        <React.Fragment>
                            <CommentBody noQuote={noQuote} comment={comment} depth={0} />
                            <div className="comment-internal-spacer" />
                        </React.Fragment>
                    )}
                </div>
                {ready && !fold && (
                    <Box className="flex justify-space-between align-center fullwidth">
                        <div className="flex ml20 mr20">
                            {settings.votebar ? (
                                <VoteBar
                                    key={threadId}
                                    commentId={comment.id}
                                    upVoteCount={comment.U || 0}
                                    downVoteCount={comment.D || 0}
                                />
                            ) : (
                                <VoteButtons
                                    upVotes={comment.U || 0}
                                    downVotes={comment.D || 0}
                                    commentId={comment.id}
                                />
                            )}
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
                        </div>
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
                <div className="comment-spacer" />
            </Box>
            {loading && (
                <Box className="flex justify-center align-center">
                    <Spinner
                        className="mt5 mb5"
                        radius={30}
                        color={settings.secondaryColor?.main}
                        stroke={4}
                        visible
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
                            <div className="flex justify-center align-center">
                                <Typography
                                    className="mt5 mb5 font-size-18-force"
                                    color="secondary"
                                >
                                    End
                                </Typography>
                            </div>
                        </React.Fragment>
                    )}
                </Box>
            )}
        </Box>
    );
}

export default memo(Comment);
