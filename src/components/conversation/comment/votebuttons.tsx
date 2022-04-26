import "./css/votebuttons.css";
import React, { useState } from "react";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Button, ButtonGroup, Typography } from "@mui/material";
import { useNotification } from "../../ContextProvider";
import { api } from "../../../lib/api";
import { useThreadId, useVotes } from "../ConversationContext";

/**
 * It creates a button group with two buttons. One for upvotes and one for downvotes.
 * @param {"U" | "D" | undefined} props.userVote user(client)'s vote
 * @param {number} props.commentId comment id
 * @param {number} props.upVotes number of upvotes
 * @param {number} props.downVotes number of downvotes
 * @returns A button group with two buttons, one for upvote and one for downvote.
 */
export default function VoteButtons(props: {
    commentId: number;
    upVotes: number;
    downVotes: number;
}) {
    const { commentId, upVotes, downVotes } = props;
    const threadId = useThreadId();
    const [votes, setVotes] = useVotes();
    const [up, setUp] = useState(upVotes);
    const [down, setDown] = useState(downVotes);
    const [, setNotification] = useNotification();
    const vote = votes?.[commentId];

    /**
     * It sends a vote to the server.
     * @param {"U" | "D"} newVote - "U" | "D"
     */
    function sendVote(newVote: "U" | "D") {
        newVote === "U" ? setUp(up + 1) : setDown(down + 1);
        setVotes({ ...votes, [commentId]: newVote });
        api.post("/posts/vote", {
            id: Number(threadId),
            cid: Number(commentId),
            vote: newVote,
        }).catch((err) => {
            newVote === "U" ? setUp(up) : setDown(down);
            setVotes(votes);
            setNotification({
                open: true,
                text: err?.response?.data?.error || err?.response?.data || "",
            });
        });
    }

    return (
        <ButtonGroup variant="text" className="vb-btn-group">
            <Button
                className="nopadding vb-btn vb-btn-left"
                disabled={!localStorage.user || !!vote}
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
                className="nopadding vb-btn vb-btn-right"
                disabled={!localStorage.user || !!vote}
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
