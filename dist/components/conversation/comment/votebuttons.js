import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./css/votebuttons.css";
import { useState } from "react";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Button, ButtonGroup, Typography } from "@mui/material";
import { useNotification, useUser } from "../../ContextProvider";
import { api } from "../../../lib/api";
import { useThreadId, useUserVotes } from "../ConversationContext";
import { parseError } from "../../../lib/parseError";
/**
 * It creates a button group with two buttons. One for upvotes and one for downvotes.
 * @param {"U" | "D" | undefined} props.userVote user(client)'s vote
 * @param {number} props.commentId comment id
 * @param {number} props.upVotes number of upvotes
 * @param {number} props.downVotes number of downvotes
 * @returns A button group with two buttons, one for upvote and one for downvote.
 */
export default function VoteButtons(props) {
    const { commentId, upVotes, downVotes } = props;
    const threadId = useThreadId();
    const [votes, setVotes] = useUserVotes();
    const [up, setUp] = useState(upVotes);
    const [down, setDown] = useState(downVotes);
    const [, setNotification] = useNotification();
    const [user] = useUser();
    const vote = votes === null || votes === void 0 ? void 0 : votes[commentId];
    /**
     * It sends a vote to the server.
     * @param {"U" | "D"} newVote - "U" | "D"
     */
    function sendVote(newVote) {
        newVote === "U" ? setUp(up + 1) : setDown(down + 1);
        setVotes(Object.assign(Object.assign({}, votes), { [commentId]: newVote }));
        api.threads.comments.vote({ threadId, commentId, vote: newVote }).catch((err) => {
            newVote === "U" ? setUp(up) : setDown(down);
            setVotes(votes);
            setNotification({
                open: true,
                text: parseError(err),
            });
        });
    }
    return (_jsxs(ButtonGroup, Object.assign({ variant: "text", className: "vb-btn-group" }, { children: [_jsx(Button, Object.assign({ className: "nopadding nomargin vb-btn vb-btn-left", disabled: !user || !!vote, onClick: () => {
                    sendVote("U");
                } }, { children: _jsxs(Typography, Object.assign({ className: "flex", sx: {
                        color: vote === "U" ? "green" : "#aaa",
                    } }, { children: [_jsx(ArrowDropUp, { className: !vote ? "icon-white-onhover" : "" }), up] })) })), _jsx(Button, Object.assign({ className: "nopadding nomargin vb-btn vb-btn-right", disabled: !user || !!vote, onClick: () => {
                    sendVote("D");
                } }, { children: _jsxs(Typography, Object.assign({ className: "flex", sx: {
                        color: vote === "D" ? "red" : "#aaa",
                    } }, { children: [_jsx(ArrowDropDown, { className: !vote ? "icon-white-onhover" : "" }), down] })) }))] })));
}
//# sourceMappingURL=votebuttons.js.map