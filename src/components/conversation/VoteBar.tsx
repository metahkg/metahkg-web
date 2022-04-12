import "./css/votebuttons.css";
import React, { useState } from "react";
import {
    Box,
    IconButton,
    LinearProgress,
    linearProgressClasses,
    Typography,
} from "@mui/material";
import axios from "axios";
import { useNotification } from "../ContextProvider";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDown from "@mui/icons-material/ThumbDown";
import { green, red } from "@mui/material/colors";

type VoteType = "U" | "D";

interface Props {
    vote?: VoteType;
    postId: number;
    clientId: number;
    upVoteCount: number;
    downVoteCount: number;
}

/**
 * It creates a button group with two buttons. One for upvotes and one for downvotes.
 * @param {"U" | "D" | undefined} props.vote user(client)'s vote
 * @param {number} props.id thread id
 * @param {number} props.cid comment id
 * @param {number} props.up number of upvotes
 * @param {number} props.down number of downvotes
 * @returns A button group with two buttons, one for upvote and one for downvote.
 */
const VoteBar = React.memo<Props>((props) => {
    const [vote, setVote] = useState(props.vote);
    const [upVoteCount, setUpVoteCount] = useState(props.upVoteCount);
    const [downVoteCount, setDownVoteCount] = useState(props.downVoteCount);
    const [, setNotification] = useNotification();

    /**
     * It sends a vote to the server.
     * @param {"U" | "D"} v - "U" | "D"
     */
    const onVote = React.useCallback(
        async (value: VoteType) => {
            setVote(value);

            if (value === "U") {
                setUpVoteCount((_) => _ + 1);
            } else {
                setDownVoteCount((_) => _ + 1);
            }

            try {
                await axios.post(
                    "/api/vote",
                    {
                        id: Number(props.postId),
                        cid: Number(props.clientId),
                        vote: value,
                    },
                    {
                        headers: { authorization: localStorage.getItem("token") || "" },
                    }
                );
            } catch (err: any) {
                value === "U"
                    ? setUpVoteCount(upVoteCount)
                    : setDownVoteCount(downVoteCount);
                setVote(undefined);
                setNotification({
                    open: true,
                    text: err?.response?.data?.error || err?.response?.data || "",
                });
            }
        },
        [downVoteCount, props.clientId, props.postId, setNotification, upVoteCount]
    );

    const isVoted = vote !== undefined;
    const totalVote = upVoteCount + downVoteCount;
    const isEmptyVote = totalVote === 0;
    const upVotePercent = (upVoteCount / totalVote) * 100;

    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <Box display="flex" width="100%" alignItems="center">
                <IconButton
                    onClick={() => onVote("U")}
                    sx={(theme) => ({
                        bgcolor: `${theme.palette.success.main} !important`,
                        mr: -1,
                        zIndex: 1,
                        transition: "all 0.2s ease-in-out",
                        transform: vote === "U" ? "scale(1.4)" : "scale(1)",
                    })}
                    size="small"
                    disabled={!localStorage.user || isVoted}
                >
                    <ThumbUpIcon
                        sx={{
                            color: vote === "U" ? green[900] : "white",
                            transform: vote === "U" ? "rotate(-15deg)" : "rotate(0deg)",
                            transition: "all 0.2s ease-in-out",
                            height: 15,
                            width: 15,
                        }}
                    />
                </IconButton>
                <LinearProgress
                    sx={(theme) => ({
                        height: 15,
                        width: "100%",
                        background: theme.palette.error.main,
                        [`& .${linearProgressClasses.bar}`]: {
                            background: isEmptyVote
                                ? theme.palette.grey[700]
                                : theme.palette.success.main,
                        },
                    })}
                    color="success"
                    variant="determinate"
                    value={upVotePercent}
                />
                <IconButton
                    onClick={() => onVote("D")}
                    sx={(theme) => ({
                        bgcolor: `${theme.palette.error.main} !important`,
                        ml: -1,
                        zIndex: 1,
                        transition: "all 0.2s ease-in-out",
                        transform: vote === "D" ? "scale(1.4)" : "scale(1)",
                    })}
                    size="small"
                    disabled={!localStorage.user || isVoted}
                >
                    <ThumbDown
                        sx={{
                            color: vote === "D" ? red[900] : "white",
                            transform: vote === "D" ? "rotate(-15deg)" : "rotate(0deg)",
                            transition: "all 0.2s ease-in-out",
                            height: 15,
                            width: 15,
                        }}
                    />
                </IconButton>
            </Box>
            <Box>
                <Typography color="grey.300" variant="body1">
                    <strong>{upVoteCount}</strong> upvotes /{" "}
                    <strong>{downVoteCount}</strong> downvotes
                </Typography>
            </Box>
        </Box>
    );
});

export default VoteBar;
