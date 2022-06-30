import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./css/votebuttons.css";
import React, { useState } from "react";
import { Box, IconButton, LinearProgress, linearProgressClasses, Typography, } from "@mui/material";
import { useNotification, useUser } from "../../ContextProvider";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDown from "@mui/icons-material/ThumbDown";
import { green, red } from "@mui/material/colors";
import { api } from "../../../lib/api";
import { useThreadId, useUserVotes } from "../ConversationContext";
import { parseError } from "../../../lib/parseError";
const VoteBar = React.memo((props) => {
    const { commentId, upVoteCount, downVoteCount } = props;
    const [votes, setVotes] = useUserVotes();
    const threadId = useThreadId();
    const vote = votes === null || votes === void 0 ? void 0 : votes[commentId];
    const [upVotes, setUpVotes] = useState(upVoteCount);
    const [downVotes, setDownVotes] = useState(downVoteCount);
    const [, setNotification] = useNotification();
    const [user] = useUser();
    /**
     * It sends a vote to the server.
     * @param {"U" | "D"} v - "U" | "D"
     */
    const onVote = React.useCallback(async (value) => {
        setVotes(Object.assign(Object.assign({}, votes), { [commentId]: value }));
        if (value === "U") {
            setUpVotes((_) => _ + 1);
        }
        else {
            setDownVotes((_) => _ + 1);
        }
        try {
            await api.threads.comments.vote({ threadId, commentId, vote: value });
        }
        catch (err) {
            value === "U" ? setUpVotes(upVotes) : setDownVotes(downVotes);
            setVotes(votes);
            setNotification({
                open: true,
                text: parseError(err),
            });
        }
    }, [setVotes, votes, commentId, threadId, upVotes, downVotes, setNotification]);
    const isVoted = vote !== undefined;
    const totalVote = upVoteCount + downVoteCount;
    const isEmptyVote = totalVote === 0;
    const upVotePercent = (upVoteCount / totalVote) * 100;
    return (_jsxs(Box, Object.assign({ display: "flex", flexDirection: "column", alignItems: "center" }, { children: [_jsxs(Box, Object.assign({ display: "flex", width: "100%", alignItems: "center" }, { children: [_jsx(IconButton, Object.assign({ onClick: () => onVote("U"), sx: (theme) => ({
                            bgcolor: `${theme.palette.success.main} !important`,
                            mr: -1,
                            zIndex: 1,
                            transition: "all 0.2s ease-in-out",
                            transform: vote === "U" ? "scale(1.4)" : "scale(1)",
                        }), size: "small", disabled: !user || isVoted }, { children: _jsx(ThumbUpIcon, { sx: {
                                color: vote === "U" ? green[900] : "white",
                                transform: vote === "U" ? "rotate(-15deg)" : "rotate(0deg)",
                                transition: "all 0.2s ease-in-out",
                                height: 15,
                                width: 15,
                            } }) })), _jsx(LinearProgress, { sx: (theme) => ({
                            height: 15,
                            width: "100%",
                            background: theme.palette.error.main,
                            [`& .${linearProgressClasses.bar}`]: {
                                background: isEmptyVote
                                    ? theme.palette.grey[700]
                                    : theme.palette.success.main,
                            },
                        }), color: "success", variant: "determinate", value: upVotePercent }), _jsx(IconButton, Object.assign({ onClick: () => onVote("D"), sx: (theme) => ({
                            bgcolor: `${theme.palette.error.main} !important`,
                            ml: -1,
                            zIndex: 1,
                            transition: "all 0.2s ease-in-out",
                            transform: vote === "D" ? "scale(1.4)" : "scale(1)",
                        }), size: "small", disabled: !user || isVoted }, { children: _jsx(ThumbDown, { sx: {
                                color: vote === "D" ? red[900] : "white",
                                transform: vote === "D" ? "rotate(-15deg)" : "rotate(0deg)",
                                transition: "all 0.2s ease-in-out",
                                height: 15,
                                width: 15,
                            } }) }))] })), _jsx(Box, { children: _jsxs(Typography, Object.assign({ color: "grey.300", variant: "body1" }, { children: [_jsx("strong", { children: upVoteCount }), " upvotes /", " ", _jsx("strong", { children: downVoteCount }), " downvotes"] })) })] })));
});
export default VoteBar;
//# sourceMappingURL=VoteBar.js.map