import "./css/comment.css";
import React, { memo } from "react";
import { Box } from "@mui/material";
import VoteBar from "./comment/VoteBar";
import { useSettings } from "../ContextProvider";
import VoteButtons from "./comment/votebuttons";
import { useThreadId } from "./ConversationContext";
import { commentType } from "../../types/conversation/comment";
import CommentTop from "./comment/commentTop";
import CommentBody from "./comment/commentBody";

/**
 * Comment component renders a comment
 * which includes a title (Tag)
 * the comment body
 * and upvote and downvote buttons
 * @param {boolean} props.op whether the comment user is op
 * @param {"M" | "F"} props.sex comment user sex
 * @param {number} props.id comment id
 * @param {number} props.tid thread id
 * @param {number} props.userid comment user id
 * @param {string} props.date created date
 * @param {number} props.up number of upvotes
 * @param {number} props.down number of downvotes
 * @param {string | undefined} props.vote user(client)'s vote
 * @param {string} props.children the comment
 * @returns a comment
 */
function Comment(props: { comment: commentType; vote?: "U" | "D"; noId?: boolean }) {
    const { comment, vote, noId } = props;
    const threadId = useThreadId();
    const [settings] = useSettings();

    return (
        <Box
            id={noId ? undefined : `c${comment.id}`}
            className="text-align-left mt6 fullwidth"
            sx={{
                bgcolor: "primary.main",
            }}
        >
            <div className="ml20 mr20">
                <CommentTop comment={comment} />
                <CommentBody comment={comment} depth={1} />
                <div className="comment-internal-spacer" />
            </div>
            <div className="ml20 mr20">
                {settings.votebar ? (
                    <VoteBar
                        key={threadId}
                        vote={vote}
                        postId={threadId}
                        clientId={comment.id}
                        upVoteCount={comment.U || 0}
                        downVoteCount={comment.D || 0}
                    />
                ) : (
                    <VoteButtons
                        vote={vote}
                        up={comment.U || 0}
                        down={comment.D || 0}
                        id={threadId}
                        cid={comment.id}
                    />
                )}
            </div>
            <div className="comment-spacer" />
        </Box>
    );
}

export default memo(Comment);
