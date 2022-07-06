import "../../../css/components/conversation/comment/votebuttons.css";
import React, { useState } from "react";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Button, ButtonGroup, Typography } from "@mui/material";
import { useNotification, useUser } from "../../ContextProvider";
import { api } from "../../../lib/api";
import { useThreadId, useUserVotes } from "../ConversationContext";
import { parseError } from "../../../lib/parseError";
import { commentType } from "../../../types/conversation/comment";

export default function VoteButtons(props: { comment: commentType }) {
    const threadId = useThreadId();
    const [votes, setVotes] = useUserVotes();
    const [, setNotification] = useNotification();
    const [user] = useUser();
    const [comment, setComment] = useState(props.comment);

    const vote = votes?.[comment.id];
    const up = comment.U || 0;
    const down = comment.D || 0;

    /**
     * It sends a vote to the server.
     * @param {"U" | "D"} newVote - "U" | "D"
     */
    function sendVote(newVote: "U" | "D") {
        api.threads.comments
            .vote({ threadId, commentId: comment.id, vote: newVote })
            .then(() => {
                // for the refetch effect to work, we need to fetch the comment again
                setComment({ ...comment, [newVote]: (comment[newVote] || 0) + 1 });
                setVotes({ ...votes, [comment.id]: newVote });
            })
            .catch((err) => {
                setNotification({
                    open: true,
                    text: parseError(err),
                });
            });
    }

    return (
        <ButtonGroup variant="text" className="vb-btn-group">
            <Button
                className="nopadding nomargin vb-btn vb-btn-left"
                disabled={!user || !!vote}
                onClick={() => {
                    sendVote("U");
                }}
            >
                <Typography
                    className="flex"
                    sx={{
                        color: vote === "U" ? "green" : "#aaa",
                    }}
                >
                    <ArrowDropUp className={!vote ? "icon-white-onhover" : ""} />
                    {up}
                </Typography>
            </Button>
            <Button
                className="nopadding nomargin vb-btn vb-btn-right"
                disabled={!user || !!vote}
                onClick={() => {
                    sendVote("D");
                }}
            >
                <Typography
                    className="flex"
                    sx={{
                        color: vote === "D" ? "red" : "#aaa",
                    }}
                >
                    <ArrowDropDown className={!vote ? "icon-white-onhover" : ""} />
                    {down}
                </Typography>
            </Button>
        </ButtonGroup>
    );
}
