import "../../../css/components/conversation/comment/votebuttons.css";
import React from "react";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Button, ButtonGroup, Typography } from "@mui/material";
import { useNotification, useUser } from "../../ContextProvider";
import { api } from "../../../lib/api";
import { useThread, useThreadId, useUserVotes } from "../ConversationContext";
import { parseError } from "../../../lib/parseError";
import { commentType } from "../../../types/conversation/comment";

export default function VoteButtons(props: { commentId: number }) {
    const { commentId } = props;
    const threadId = useThreadId();
    const [thread, setThread] = useThread();
    const [votes, setVotes] = useUserVotes();
    const [, setNotification] = useNotification();
    const [user] = useUser();

    const comment = thread?.conversation?.find((i) => i.id === commentId) as commentType;
    if (!comment) return <React.Fragment />;

    const vote = votes?.[commentId];
    const up = comment.U || 0;
    const down = comment.D || 0;

    /**
     * It sends a vote to the server.
     * @param {"U" | "D"} newVote - "U" | "D"
     */
    function sendVote(newVote: "U" | "D") {
        if (thread) {
            thread.conversation[thread.conversation.findIndex((i) => i.id === commentId)][
                newVote
            ] = (comment[newVote] || 0) + 1;
            setThread(thread);
        }
        setVotes({ ...votes, [commentId]: newVote });
        api.threads.comments
            .vote({ threadId, commentId: commentId, vote: newVote })
            .catch((err) => {
                setVotes(votes);
                if (thread) {
                    thread.conversation[
                        thread.conversation.findIndex((i) => i.id === commentId)
                    ] = { ...comment, [newVote]: comment[newVote] };
                    setThread(thread);
                }
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
