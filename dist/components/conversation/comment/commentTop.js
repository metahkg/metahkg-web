import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Visibility, VisibilityOff, Reply as ReplyIcon, Share as ShareIcon, Feed as FeedIcon, Edit, PushPin, } from "@mui/icons-material";
import { IconButton, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PopUp } from "../../../lib/popup";
import { useCRoot, useEditor, useStory, useThread, useThreadId, useTitle, } from "../ConversationContext";
import { useShareLink, useShareOpen, useShareTitle } from "../ShareProvider";
import dateAndTime from "date-and-time";
import { isMobile } from "react-device-detect";
import { timeToWord } from "../../../lib/common";
import MoreList from "./more";
import { useNotification, useUser } from "../../ContextProvider";
import { api } from "../../../lib/api";
import React from "react";
import { parseError } from "../../../lib/parseError";
export default function CommentTop(props) {
    const [open, setOpen] = useState(false);
    const [timeMode, setTimeMode] = useState("short");
    const [, setShareLink] = useShareLink();
    const [, setShareTitle] = useShareTitle();
    const [, setShareOpen] = useShareOpen();
    const [story, setStory] = useStory();
    const [, setNotification] = useNotification();
    const threadId = useThreadId();
    const title = useTitle();
    const navigate = useNavigate();
    const [thread, setThread] = useThread();
    const [user] = useUser();
    const [, setEditor] = useEditor();
    const croot = useCRoot();
    const { comment, noStory, fold } = props;
    const isOp = thread && thread.op.id === comment.user.id;
    const leftBtns = [
        (story ? story === comment.user.id : 1) &&
            !noStory && {
            icon: story ? (_jsx(VisibilityOff, { className: "metahkg-grey-force font-size-19-force" })) : (_jsx(Visibility, { className: "metahkg-grey-force font-size-19-force" })),
            title: story ? "Quit story mode" : "Story mode",
            action: () => {
                var _a;
                const commentEle = document.getElementById(`c${comment.id}`);
                if (croot.current && commentEle) {
                    const beforeHeight = (commentEle === null || commentEle === void 0 ? void 0 : commentEle.offsetTop) - 47 - ((_a = croot.current) === null || _a === void 0 ? void 0 : _a.scrollTop);
                    setStory(story ? 0 : comment.user.id);
                    setTimeout(() => {
                        var _a;
                        const commentEle = document.getElementById(`c${comment.id}`);
                        if (croot.current && commentEle) {
                            const afterHeight = (commentEle === null || commentEle === void 0 ? void 0 : commentEle.offsetTop) - 47 - ((_a = croot.current) === null || _a === void 0 ? void 0 : _a.scrollTop);
                            croot.current.scrollTop += afterHeight - beforeHeight;
                        }
                    });
                }
            },
        },
        {
            icon: _jsx(ReplyIcon, { className: "metahkg-grey-force font-size-21-force mb1" }),
            title: "Quote",
            action: () => {
                if (user)
                    setEditor({ open: true, quote: comment });
                else
                    navigate(`/users/login?continue=true&returnto=${encodeURIComponent(`/thread/${threadId}`)}`);
            },
        },
    ];
    const rightBtns = [
        {
            icon: _jsx(ShareIcon, { className: "metahkg-grey-force font-size-19-force" }),
            title: "Share",
            action: () => {
                setShareLink(comment.slink ||
                    `${window.location.origin}/thread/${threadId}?c=${comment.id}`);
                setShareTitle(title + ` - comment #${comment.id}`);
                setShareOpen(true);
            },
        },
    ];
    const moreList = [
        (() => {
            var _a;
            const clientIsOp = thread && (user === null || user === void 0 ? void 0 : user.id) === thread.op.id;
            const pinned = ((_a = thread === null || thread === void 0 ? void 0 : thread.pin) === null || _a === void 0 ? void 0 : _a.id) === comment.id;
            if (clientIsOp || ((user === null || user === void 0 ? void 0 : user.role) === "admin" && pinned)) {
                const onError = (err) => {
                    setNotification({
                        open: true,
                        text: parseError(err),
                    });
                };
                return {
                    icon: _jsx(PushPin, {}),
                    title: `${pinned ? "Unpin" : "Pin"} Comment`,
                    action: () => {
                        setNotification({
                            open: true,
                            text: `${pinned ? "Unpin" : "Pin"}ing Comment...`,
                        });
                        (pinned
                            ? api.threads.unpin({ threadId })
                            : api.threads.pin({ threadId, commentId: comment.id }))
                            .then(() => {
                            setNotification({
                                open: true,
                                text: `Comment ${pinned ? "un" : ""}pinned!`,
                            });
                            setThread((thread) => {
                                if (!pinned && thread)
                                    thread.pin = comment;
                                else if (thread)
                                    delete thread.pin;
                                return thread;
                            });
                        })
                            .catch(onError);
                    },
                };
            }
            return undefined;
        })(),
        {
            icon: _jsx(FeedIcon, { className: "font-size-19-force" }),
            title: "Create new thread",
            action: () => {
                navigate(`/create?quote=${threadId}.${comment.id}`);
            },
        },
        {
            icon: _jsx(Edit, { className: "font-size-19-force" }),
            title: "Edit comment",
            action: () => {
                navigate(`/comment/${threadId}?edit=${comment.id}`);
            },
        },
    ];
    return (_jsxs("div", Object.assign({ className: `flex align-center font-size-17 pt10 ${!fold ? "justify-space-between" : ""}` }, { children: [_jsx(PopUp, Object.assign({ open: open, setOpen: setOpen, title: "User information", buttons: [{ text: "View Profile", link: `/profile/${comment.user.id}` }] }, { children: _jsxs("p", Object.assign({ className: "text-align-center mt5 mb5 font-size-20" }, { children: [comment.user.name, _jsx("br", {}), "#", comment.user.id] })) })), _jsxs("div", Object.assign({ className: `flex align-center ${!fold ? "comment-tag-left" : "fullwidth"}` }, { children: [_jsxs(Typography, Object.assign({ className: "novmargin font-size-17-force", sx: (theme) => ({
                            color: isOp ? theme.palette.secondary.main : "#aca9a9",
                        }) }, { children: ["#", comment.id] })), _jsx("p", Object.assign({ className: "comment-tag-userlink novmargin ml10 text-overflow-ellipsis nowrap pointer overflow-hidden max-width-full", onClick: () => {
                            setOpen(true);
                        }, style: {
                            color: comment.user.sex === "M" ? "#34aadc" : "red",
                        } }, { children: comment.user.name })), _jsx(Tooltip, Object.assign({ title: dateAndTime.format(new Date(comment.createdAt), "ddd, MMM DD YYYY HH:mm:ss"), arrow: true }, { children: _jsx("p", Object.assign({ onClick: () => {
                                if (isMobile) {
                                    setTimeMode(timeMode === "short" ? "long" : "short");
                                }
                            }, className: `novmargin metahkg-grey ml10 font-size-15${isMobile ? " pointer" : ""}` }, { children: {
                                short: timeToWord(comment.createdAt),
                                long: dateAndTime.format(new Date(comment.createdAt), "DD/MM/YY HH:mm"),
                            }[timeMode] })) })), fold && (_jsxs(React.Fragment, { children: [_jsx("p", Object.assign({ className: "novmargin ml5 metahkg-grey" }, { children: ":" })), _jsx("p", Object.assign({ className: "novmargin comment-body break-word-force ml10 nowrap overflow-hidden text-overflow-ellipsis", style: { display: "inline-block" } }, { children: comment.text }))] })), !fold &&
                        leftBtns.map((button, index) => button && (_jsx(Tooltip, Object.assign({ title: button.title, arrow: true }, { children: _jsx(IconButton, Object.assign({ className: "ml10 nopadding", onClick: button.action }, { children: button.icon })) }), index)))] })), _jsxs("div", Object.assign({ className: "flex align-center" }, { children: [!fold &&
                        rightBtns.map((button, index) => (_jsx(Tooltip, Object.assign({ title: button.title, arrow: true }, { children: _jsx(IconButton, Object.assign({ className: "ml10 nopadding", onClick: button.action }, { children: button.icon })) }), index))), !fold && _jsx(MoreList, { buttons: moreList })] }))] })));
}
//# sourceMappingURL=commentTop.js.map