/*
 Copyright (C) 2022-present Metahkg Contributors

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import {
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Reply as ReplyIcon,
    Share as ShareIcon,
    Feed as FeedIcon,
    Edit as EditIcon,
    PushPin as PushPinIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material";
import { Box, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    useCRoot,
    useEditor,
    useStory,
    useThread,
    useThreadId,
    useTitle,
} from "../ConversationContext";
import { useShareLink, useShareOpen, useShareTitle } from "../ShareProvider";
import dateAndTime from "date-and-time";
import { isMobile } from "react-device-detect";
import { timeToWord, wholePath } from "../../../lib/common";
import MoreList from "./more";
import {
    useAlertDialog,
    useBlockList,
    useNotification,
    useSettings,
    useUser,
} from "../../AppContextProvider";
import { api } from "../../../lib/api";
import { AxiosError } from "axios";
import React from "react";
import { parseError } from "../../../lib/parseError";
import { Comment } from "@metahkg/api";
import { filterSwearWords } from "../../../lib/filterSwear";
import UserModal from "./userModal";
import { colors, css } from "../../../lib/css";
import BlockedBtn from "./blockedBtn";
import { useBlocked, useEditing, useFold, useInThread } from "../comment";

export default function CommentTop(props: { comment: Comment; noStory?: boolean }) {
    const [open, setOpen] = useState(false);
    const [timeMode, setTimeMode] = useState<"short" | "long">("short");
    const [, setShareLink] = useShareLink();
    const [, setShareTitle] = useShareTitle();
    const [, setShareOpen] = useShareOpen();
    const [story, setStory] = useStory();
    const [, setNotification] = useNotification();
    const [settings] = useSettings();
    const threadId = useThreadId();
    const title = useTitle();
    const navigate = useNavigate();
    const [thread, setThread] = useThread();
    const [user] = useUser();
    const [, setEditor] = useEditor();
    const [blockList] = useBlockList();
    const [fold, setFold] = useFold();
    const [blocked, setBlocked] = useBlocked();
    const [, setEditing] = useEditing();
    const [alertDialog, setAlertDialog] = useAlertDialog();
    const inThread = useInThread();

    const cRoot = useCRoot();

    const { comment, noStory } = props;

    const isOp = thread && thread.op.id === comment.user.id;

    const leftBtns = useMemo(
        () =>
            [
                (story ? story === comment.user.id : 1) &&
                    !noStory && {
                        icon: React.createElement(
                            story ? VisibilityOffIcon : VisibilityIcon,
                            {
                                className: "!text-metahkg-grey !text-[19px]",
                            }
                        ),
                        title: story ? "Quit story mode" : "Story mode",
                        action: () => {
                            const commentEle = document.getElementById(`c${comment.id}`);
                            if (cRoot.current && commentEle) {
                                const beforeHeight =
                                    commentEle?.offsetTop - 47 - cRoot.current?.scrollTop;
                                setStory(story ? 0 : comment.user.id);
                                setTimeout(() => {
                                    const commentEle = document.getElementById(
                                        `c${comment.id}`
                                    );
                                    if (cRoot.current && commentEle) {
                                        const afterHeight =
                                            commentEle?.offsetTop -
                                            47 -
                                            cRoot.current?.scrollTop;
                                        cRoot.current.scrollTop +=
                                            afterHeight - beforeHeight;
                                    }
                                });
                            }
                        },
                    },
                {
                    icon: (
                        <ReplyIcon className="!text-metahkg-grey !text-[19px] !mb-[1px]" />
                    ),
                    title: "Reply",
                    action: () => {
                        if (user) setEditor({ open: true, quote: comment });
                        else
                            navigate(
                                `/users/login?continue=true&returnto=${encodeURIComponent(
                                    `${wholePath()}?c=${comment.id}`
                                )}`
                            );
                    },
                },
                user?.role === "admin" &&
                    inThread && {
                        icon: (
                            <EditIcon className="!text-metahkg-grey !text-[18px] !mb-[1px]" />
                        ),
                        title: "Edit (admin)",
                        action: () => {
                            setEditing((editing) => !editing);
                        },
                    },
                user?.role === "admin" &&
                    inThread && {
                        icon: (
                            <DeleteIcon className="!text-metahkg-grey !text-[17px] !mb-[1px]" />
                        ),
                        title: "Delete (admin)",
                        action: () => {
                            setAlertDialog({
                                ...alertDialog,
                                open: true,
                                title: "Are you sure you want to delete this comment?",
                                body: (state, setState) => (
                                    <TextField
                                        color="secondary"
                                        label="Reason"
                                        required
                                        variant="outlined"
                                        className="!my-[5px]"
                                        onChange={(e) => {
                                            setState({
                                                ...state,
                                                reason: e.target.value,
                                            });
                                        }}
                                    />
                                ),
                                btns: (state, _setState) => [
                                    {
                                        text: "Cancel",
                                        action: (_state, _setState, closeDialog) => {
                                            closeDialog();
                                        },
                                    },
                                    {
                                        text: "Confirm",
                                        disabled: !state.reason,
                                        action: (state, _setState, closeDialog) => {
                                            api.commentDelete(threadId, comment.id, {
                                                reason: state.reason,
                                            })
                                                .then(() => {
                                                    closeDialog();
                                                    if (thread)
                                                        setThread({
                                                            ...thread,
                                                            conversation:
                                                                thread.conversation.filter(
                                                                    (v) =>
                                                                        v.id !==
                                                                        comment.id
                                                                ),
                                                        });
                                                    setNotification({
                                                        open: true,
                                                        severity: "success",
                                                        text: "Comment deleted.",
                                                    });
                                                })
                                                .catch((err) => {
                                                    closeDialog();
                                                    setNotification({
                                                        open: true,
                                                        severity: "error",
                                                        text: parseError(err),
                                                    });
                                                });
                                        },
                                    },
                                ],
                            });
                        },
                    },
            ].filter((x) => x),
        [
            story,
            comment,
            noStory,
            user,
            inThread,
            cRoot,
            setStory,
            setEditor,
            navigate,
            setEditing,
            setAlertDialog,
            alertDialog,
            threadId,
            thread,
            setThread,
            setNotification,
        ]
    );

    const rightBtns: {
        icon: JSX.Element;
        title: string;
        action: () => void;
    }[] = useMemo(
        () => [
            {
                icon: <ShareIcon className="!text-metahkg-grey !text-[19px]" />,
                title: "Share",
                action: () => {
                    setShareLink(
                        comment.slink ||
                            `${window.location.origin}/thread/${threadId}?c=${comment.id}`
                    );
                    setShareTitle(title + ` - comment #${comment.id}`);
                    setShareOpen(true);
                },
            },
        ],
        [
            comment.id,
            comment.slink,
            setShareLink,
            setShareOpen,
            setShareTitle,
            threadId,
            title,
        ]
    );

    const moreList: (
        | { icon: JSX.Element; title: string; action: () => void }
        | undefined
    )[] = [
        (() => {
            const clientIsOp = thread && user?.id === thread.op.id;
            const pinned = thread?.pin?.id === comment.id;
            if (clientIsOp || (user?.role === "admin" && pinned)) {
                const onError = (err: AxiosError<any>) => {
                    setNotification({
                        open: true,
                        severity: "error",
                        text: parseError(err),
                    });
                };
                return {
                    icon: <PushPinIcon />,
                    title: `${pinned ? "Unpin" : "Pin"} Comment`,
                    action: () => {
                        setNotification({
                            open: true,
                            severity: "info",
                            text: `${pinned ? "Unpinn" : "Pinn"}ing Comment...`,
                        });
                        (pinned
                            ? api.threadUnpin(threadId)
                            : api.threadPin(threadId, { cid: comment.id })
                        )
                            .then(() => {
                                setNotification({
                                    open: true,
                                    severity: "success",
                                    text: `Comment ${pinned ? "un" : ""}pinned!`,
                                });
                                setThread((thread) => {
                                    if (!pinned && thread) thread.pin = comment;
                                    else if (thread) delete thread.pin;
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
            icon: <FeedIcon className="!text-[19px]" />,
            title: "Create thread",
            action: () => {
                navigate(`/create?quote=${threadId}.${comment.id}`);
            },
        },
        {
            icon: <EditIcon className="!text-[19px]" />,
            title: "Edit (in new comment)",
            action: () => {
                if (user) setEditor({ open: true, edit: comment.comment });
                else
                    navigate(
                        `/users/login?continue=true&returnto=${encodeURIComponent(
                            `${wholePath()}?c=${comment.id}`
                        )}`
                    );
            },
        },
    ];

    return (
        <Box className={`flex items-end text-lg !pt-2 ${!fold ? "justify-between" : ""}`}>
            <UserModal open={open} setOpen={setOpen} user={comment.user} />
            <Box
                className={`flex items-center ${
                    !fold ? "max-w-[calc(100%-75px)]" : "w-full"
                }`}
            >
                <Typography
                    sx={(theme) => ({
                        color: isOp ? theme.palette.secondary.main : colors.grey,
                    })}
                    className="!leading-7"
                    variant="body2"
                >
                    #{comment.id}
                </Typography>
                <Typography
                    variant="subtitle1"
                    className={`!ml-2 !text-[17px] !leading-7 max-h-7 text-ellipsis whitespace-nowrap cursor-pointer overflow-hidden max-w-full ${
                        comment.user.name.length > 5 || fold || blocked
                            ? "min-w-[50px]"
                            : ""
                    } hover:underline ${
                        comment.user.sex === "M" ? css.colors.blue : "text-[red]"
                    }`}
                    onClick={() => {
                        setOpen(true);
                    }}
                    component="p"
                >
                    {comment.user.name}
                </Typography>
                <Tooltip
                    title={dateAndTime.format(
                        new Date(comment.createdAt),
                        "ddd, MMM DD YYYY HH:mm:ss"
                    )}
                    arrow
                >
                    <Typography
                        variant="body2"
                        onClick={() => {
                            if (isMobile)
                                setTimeMode(timeMode === "short" ? "long" : "short");
                        }}
                        className={`text-metahkg-grey !leading-7 !ml-2 !mr-1${
                            isMobile ? " cursor-pointer" : ""
                        }`}
                    >
                        {
                            {
                                short: timeToWord(comment.createdAt),
                                long: dateAndTime.format(
                                    new Date(comment.createdAt),
                                    "DD/MM/YY HH:mm"
                                ),
                            }[timeMode]
                        }
                    </Typography>
                </Tooltip>
                {fold && !blocked && (
                    <Box
                        onClick={() => {
                            setFold && setFold(false);
                        }}
                        sx={{ flexGrow: 1 }}
                        className="cursor-pointer flex overflow-hidden"
                    >
                        <Typography className={"!ml-1 text-metahkg-grey"}>:</Typography>
                        <Typography className="!break-words !ml-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-full inline-block">
                            {settings.filterSwearWords
                                ? filterSwearWords(comment.text)
                                : comment.text}
                        </Typography>
                    </Box>
                )}
                {blocked && (
                    <BlockedBtn
                        className="!ml-5"
                        userName={comment.user.name}
                        reason={blockList.find((x) => x.id === comment.user.id)?.reason}
                        setBlocked={setBlocked}
                    />
                )}
                {!fold &&
                    !blocked &&
                    leftBtns.map(
                        (button, index) =>
                            button && (
                                <Tooltip key={index} title={button.title} arrow>
                                    <IconButton
                                        className="!ml-2 !p-0"
                                        onClick={button.action}
                                    >
                                        {button.icon}
                                    </IconButton>
                                </Tooltip>
                            )
                    )}
            </Box>
            {!fold && !blocked && (
                <Box className="flex items-center">
                    {rightBtns.map((button, index) => (
                        <Tooltip key={index} title={button.title} arrow>
                            <IconButton className="!ml-2 !p-0" onClick={button.action}>
                                {button.icon}
                            </IconButton>
                        </Tooltip>
                    ))}
                    <MoreList buttons={moreList} />
                </Box>
            )}
        </Box>
    );
}
