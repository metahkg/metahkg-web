import "./css/comment.css";
import React, { memo, useEffect, useState } from "react";
import { Box } from "@mui/material";
import VoteBar from "./comment/VoteBar";
import { useNotification, useSettings } from "../ContextProvider";
import VoteButtons from "./comment/votebuttons";
import { useThreadId } from "./ConversationContext";
import { commentType } from "../../types/conversation/comment";
import CommentTop from "./comment/commentTop";
import CommentBody from "./comment/commentBody";
import { api } from "../../lib/api";

/**
 * Comment component renders a comment
 * which includes a title (Tag)
 * the comment body
 * and upvote and downvote buttons
 */
function Comment(props: {
    comment: commentType;
    noId?: boolean;
    fetchComment?: boolean;
}) {
    const { noId, fetchComment } = props;
    const threadId = useThreadId();
    const [settings] = useSettings();
    const [comment, setComment] = useState(props.comment);
    const [, setNotification] = useNotification();
    const [ready, setReady] = useState(!fetchComment);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Box
            id={noId ? undefined : `c${comment.id}`}
            className="text-align-left mt6 fullwidth comment-root"
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
                <CommentBody comment={comment} depth={1} />
                <div className="comment-internal-spacer" />
            </div>
            {ready && (
                <div className="ml20 mr20">
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
                </div>
            )}
            <div className="comment-spacer" />
        </Box>
    );
}

export default memo(Comment);
