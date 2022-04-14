import "./css/votebuttons.css";
import React, { useState } from "react";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Button, ButtonGroup, Typography } from "@mui/material";
import { useNotification } from "../ContextProvider";
import { api } from "../../lib/api";

/**
 * It creates a button group with two buttons. One for upvotes and one for downvotes.
 * @param {"U" | "D" | undefined} props.vote user(client)'s vote
 * @param {number} props.id thread id
 * @param {number} props.cid comment id
 * @param {number} props.up number of upvotes
 * @param {number} props.down number of downvotes
 * @returns A button group with two buttons, one for upvote and one for downvote.
 */
export default function VoteButtons(props: {
    vote?: "U" | "D";
    id: number;
    cid: number;
    up: number;
    down: number;
}) {
    const [vote, setVote] = useState(props.vote);
    const [up, setUp] = useState(props.up);
    const [down, setDown] = useState(props.down);
    const [, setNotification] = useNotification();

    /**
     * It sends a vote to the server.
     * @param {"U" | "D"} v - "U" | "D"
     */
    function sendvote(v: "U" | "D") {
        v === "U" ? setUp(up + 1) : setDown(down + 1);
        setVote(v);
        api.post("/posts/vote", {
            id: Number(props.id),
            cid: Number(props.cid),
            vote: v,
        }).catch((err) => {
            v === "U" ? setUp(up) : setDown(down);
            setVote(undefined);
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
                    sendvote("U");
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
                    sendvote("D");
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
