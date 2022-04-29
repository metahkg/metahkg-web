import "./css/comment.css";
import React, { memo, useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import VoteBar from "./comment/VoteBar";
import { useNotification, useSettings } from "../ContextProvider";
import VoteButtons from "./comment/votebuttons";
import { useThreadId } from "./ConversationContext";
import { commentType } from "../../types/conversation/comment";
import CommentTop from "./comment/commentTop";
import CommentBody from "./comment/commentBody";
import { api } from "../../lib/api";
import { Forum, KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import Spinner from "react-spinner-material";
import CommentPopup from "../../lib/commentPopup";

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
    goTo?: boolean;
    blocked?: boolean;
}) {
    const { noId, fetchComment, inPopUp, noQuote, setIsExpanded } = props;
    const threadId = useThreadId();
    const [settings] = useSettings();
    const [comment, setComment] = useState(props.comment);
    const [, setNotification] = useNotification();
    const [ready, setReady] = useState(!fetchComment);
    const [showReplies, setShowReplies] = useState(props.showReplies);
    const [replies, setReplies] = useState<commentType[]>([]);
    const [loading, setLoading] = useState(false);
    const [popupOpen, setPopupOpen] = useState(false);

    useEffect(() => {
        if (fetchComment) {
            api.get(`/posts/thread/${threadId}/comment/${comment.id}`)
                .then((res) => {
                    setComment(res.data);
                    setReady(true);
                })
                .catch((err) => {
                    setNotification({
                        open: true,
                        text: err?.response?.data?.errpr || err?.response?.data || "",
                    });
                });
        }
        if (inPopUp) {
            setLoading(true);
            api.get(`/posts/thread/${threadId}/replies/${comment.id}`)
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
        <Box className="fullwidth">
            {comment.replies?.length && (
                <CommentPopup
                    comment={comment}
                    showReplies
                    open={popupOpen}
                    setOpen={setPopupOpen}
                />
            )}
            <Box
                id={noId ? undefined : `c${comment.id}`}
                className={`text-align-left ${
                    !inPopUp ? "mt6" : ""
                } fullwidth comment-root`}
                sx={(theme) => ({
                    "& *::selection": {
                        background: theme.palette.secondary.main,
                        color: "black",
                    },
                    bgcolor: "primary.main",
                })}
            >
                <div className="ml20 mr20">
                    <CommentTop comment={comment} />
                    <CommentBody noQuote={noQuote} comment={comment} depth={0} />
                    <div className="comment-internal-spacer" />
                </div>
                {ready && (
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
                                <Comment comment={comment} noId noQuote />
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
