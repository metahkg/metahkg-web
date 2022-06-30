import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./css/comment.css";
import React, { memo, useEffect, useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import VoteBar from "./comment/VoteBar";
import { useNotification, useSettings } from "../ContextProvider";
import VoteButtons from "./comment/votebuttons";
import { useThreadId } from "./ConversationContext";
import CommentTop from "./comment/commentTop";
import CommentBody from "./comment/commentBody";
import { api } from "../../lib/api";
import { EscalatorOutlined, Forum, KeyboardArrowDown, KeyboardArrowUp, } from "@mui/icons-material";
import Spinner from "react-spinner-material";
import CommentPopup from "../../lib/commentPopup";
import { parseError } from "../../lib/parseError";
/**
 * Comment component renders a comment
 * which includes a title (Tag)
 * the comment body
 * and upvote and downvote buttons
 */
function Comment(props) {
    var _a, _b, _c, _d;
    const { noId, scrollIntoView, fetchComment, inPopUp, noQuote, setIsExpanded, noStory, openComment, } = props;
    const threadId = useThreadId();
    const [settings] = useSettings();
    const [comment, setComment] = useState(props.comment);
    const [, setNotification] = useNotification();
    const [ready, setReady] = useState(!fetchComment);
    const [showReplies, setShowReplies] = useState(props.showReplies);
    const [replies, setReplies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [popupOpen, setPopupOpen] = useState(false);
    const [fold, setFold] = useState(props.fold);
    const commentRef = useRef(null);
    useEffect(() => {
        commentRef.current && scrollIntoView && commentRef.current.scrollIntoView();
        if (fetchComment) {
            api.threads.comments
                .get({ threadId, commentId: comment.id })
                .then((res) => {
                setComment(res.data);
                setReady(true);
            })
                .catch((err) => {
                setNotification({
                    open: true,
                    text: parseError(err),
                });
            });
        }
        if (inPopUp) {
            setLoading(true);
            api.threads.comments
                .replies({ threadId, commentId: comment.id })
                .then((res) => {
                setReplies(res.data);
                setLoading(false);
            })
                .catch(() => {
                setLoading(false);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (_jsxs(Box, Object.assign({ className: `fullwidth ${fold ? "pointer" : ""}`, onClick: () => {
            fold && setFold(false);
        }, ref: commentRef, id: noId ? undefined : `c${comment.id}` }, { children: [((_a = comment.replies) === null || _a === void 0 ? void 0 : _a.length) && (_jsx(CommentPopup, { comment: comment, showReplies: true, open: popupOpen, setOpen: setPopupOpen, openComment: true })), _jsxs(Box, Object.assign({ className: `text-align-left ${!inPopUp ? "mt6" : showReplies ? "" : "overflow-auto"} fullwidth comment-root`, sx: (theme) => ({
                    "& *::selection": {
                        background: theme.palette.secondary.main,
                        color: "black",
                    },
                    bgcolor: "primary.main",
                    maxHeight: inPopUp && !showReplies ? "90vh" : "",
                }) }, { children: [_jsxs("div", Object.assign({ className: "ml20 mr20" }, { children: [_jsx(CommentTop, { comment: comment, noStory: noStory, fold: fold }), !fold && (_jsxs(React.Fragment, { children: [_jsx(CommentBody, { noQuote: noQuote, comment: comment, depth: 0 }), _jsx("div", { className: "comment-internal-spacer" })] }))] })), ready && !fold && (_jsxs(Box, Object.assign({ className: "flex justify-space-between align-center fullwidth" }, { children: [_jsxs("div", Object.assign({ className: "flex ml20 mr20" }, { children: [settings.votebar ? (_jsx(VoteBar, { commentId: comment.id, upVoteCount: comment.U || 0, downVoteCount: comment.D || 0 }, threadId)) : (_jsx(VoteButtons, { upVotes: comment.U || 0, downVotes: comment.D || 0, commentId: comment.id })), !inPopUp && ((_b = comment.replies) === null || _b === void 0 ? void 0 : _b.length) && (_jsxs(Button, Object.assign({ sx: {
                                            minWidth: "0 !important",
                                            bgcolor: "#333 !important",
                                        }, className: "br5 nomargin ml10 metahkg-grey-force nopadding mt0 mb0 pl10 pr10 pt3 pb3", variant: "text", onClick: () => {
                                            setPopupOpen(true);
                                        } }, { children: [_jsx(Forum, { sx: {
                                                    "&:hover": {
                                                        color: "white",
                                                    },
                                                }, className: "font-size-14-force" }), _jsx("p", Object.assign({ className: "ml5 novmargin metahkg-grey" }, { children: (_c = comment.replies) === null || _c === void 0 ? void 0 : _c.length }))] })))] })), openComment && (_jsxs("a", Object.assign({ href: `/thread/${threadId}?c=${comment.id}`, target: "_blank", rel: "noreferrer", className: "flex metahkg-grey-force mr10 notextdecoration" }, { children: [_jsx(EscalatorOutlined, {}), "Open Comment"] })))] }))), _jsx("div", { className: "comment-spacer" })] })), loading && (_jsx(Box, Object.assign({ className: "flex justify-center align-center" }, { children: _jsx(Spinner, { className: "mt5 mb5", radius: 30, color: (_d = settings.secondaryColor) === null || _d === void 0 ? void 0 : _d.main, stroke: 4, visible: true }) }))), !!replies.length && (_jsxs(Box, { children: [_jsxs(Box, Object.assign({ className: "flex align-center justify-center text-align-center pointer", onClick: () => {
                            setShowReplies(!showReplies);
                            setIsExpanded && setIsExpanded(!showReplies);
                        } }, { children: [_jsxs(Typography, Object.assign({ className: "mt5 mb5", color: "secondary" }, { children: [showReplies ? "Hide" : "Show", " Replies"] })), showReplies ? (_jsx(KeyboardArrowUp, { color: "secondary" })) : (_jsx(KeyboardArrowDown, { color: "secondary" }))] })), showReplies && (_jsxs(React.Fragment, { children: [replies.map((comment) => (_jsx(Comment, { comment: comment, noId: true, noQuote: true, noStory: true, openComment: true }))), _jsx("div", Object.assign({ className: "flex justify-center align-center" }, { children: _jsx(Typography, Object.assign({ className: "mt5 mb5 font-size-18-force", color: "secondary" }, { children: "End" })) }))] }))] }))] })));
}
export default memo(Comment);
//# sourceMappingURL=comment.js.map