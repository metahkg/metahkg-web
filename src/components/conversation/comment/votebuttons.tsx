import "../../../css/components/conversation/comment/votebuttons.css";
import React, { useState } from "react";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Button, ButtonGroup, Typography } from "@mui/material";
import { useNotification, useUser } from "../../ContextProvider";
import { api } from "../../../lib/api";
import { useThreadId, useVotes } from "../ConversationContext";
import { parseError } from "../../../lib/parseError";
import { Comment, Vote } from "@metahkg/api";

export default function VoteButtons(props: { comment: Comment }) {
    const threadId = useThreadId();
    const [votes, setVotes] = useVotes();
    const [, setNotification] = useNotification();
    const [user] = useUser();
    const [comment, setComment] = useState(props.comment);

    const vote = votes?.find((v) => v.cid === comment.id)?.vote;
    const up = comment.U || 0;
    const down = comment.D || 0;

    /**
     * It sends a vote to the server.
     * @param {"U" | "D"} newVote - "U" | "D"
     */
    function sendVote(newVote: Vote) {
        api.commentVote({ vote: newVote }, threadId, comment.id)
            .then(() => {
                // for the refetch effect to work, we need to fetch the comment again
                setComment({ ...comment, [newVote]: (comment[newVote] || 0) + 1 });
                votes && setVotes([...votes, { cid: comment.id, vote: newVote }]);
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
                className="!p-0 !m-0 vb-btn vb-btn-left"
                disabled={!user || !!vote}
                onClick={() => {
                    sendVote(Vote.U);
                }}
            >
                <Typography
                    className="flex"
                    sx={{
                        color: vote === Vote.U ? "green" : "#aaa",
                    }}
                >
                    <ArrowDropUp className={!vote ? "hover:!text-[#fff]" : ""} />
                    {up}
                </Typography>
            </Button>
            <Button
                className="!p-0 !m-0 vb-btn vb-btn-right"
                disabled={!user || !!vote}
                onClick={() => {
                    sendVote(Vote.D);
                }}
            >
                <Typography
                    className="flex"
                    sx={{
                        color: vote === Vote.D ? "red" : "#aaa",
                    }}
                >
                    <ArrowDropDown className={!vote ? "hover:!text-[#fff]" : ""} />
                    {down}
                </Typography>
            </Button>
        </ButtonGroup>
    );
}
