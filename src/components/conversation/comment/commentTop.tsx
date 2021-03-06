import {
    Visibility,
    VisibilityOff,
    Reply as ReplyIcon,
    Share as ShareIcon,
    Feed as FeedIcon,
    Edit,
    PushPin,
} from "@mui/icons-material";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PopUp } from "../../../lib/popup";
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
import { useNotification, useUser } from "../../ContextProvider";
import { api } from "../../../lib/api";
import { AxiosError } from "axios";
import React from "react";
import { parseError } from "../../../lib/parseError";
import { Comment } from "@metahkg/api";

export default function CommentTop(props: {
    comment: Comment;
    noStory?: boolean;
    fold?: boolean;
    setFold?: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}) {
    const [open, setOpen] = useState(false);
    const [timeMode, setTimeMode] = useState<"short" | "long">("short");
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
    const cRoot = useCRoot();

    const { comment, noStory, fold, setFold } = props;

    const isOp = thread && thread.op.id === comment.user.id;

    const leftBtns = [
        (story ? story === comment.user.id : 1) &&
            !noStory && {
                icon: story ? (
                    <VisibilityOff className="metahkg-grey-force font-size-19-force" />
                ) : (
                    <Visibility className="metahkg-grey-force font-size-19-force" />
                ),
                title: story ? "Quit story mode" : "Story mode",
                action: () => {
                    const commentEle = document.getElementById(`c${comment.id}`);
                    if (cRoot.current && commentEle) {
                        const beforeHeight =
                            commentEle?.offsetTop - 47 - cRoot.current?.scrollTop;
                        setStory(story ? 0 : comment.user.id);
                        setTimeout(() => {
                            const commentEle = document.getElementById(`c${comment.id}`);
                            if (cRoot.current && commentEle) {
                                const afterHeight =
                                    commentEle?.offsetTop - 47 - cRoot.current?.scrollTop;
                                cRoot.current.scrollTop += afterHeight - beforeHeight;
                            }
                        });
                    }
                },
            },
        {
            icon: <ReplyIcon className="metahkg-grey-force font-size-21-force mb1" />,
            title: "Quote",
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
    ];
    const rightBtns: {
        icon: JSX.Element;
        title: string;
        action: () => void;
    }[] = [
        {
            icon: <ShareIcon className="metahkg-grey-force font-size-19-force" />,
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
    ];
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
                        text: parseError(err),
                    });
                };
                return {
                    icon: <PushPin />,
                    title: `${pinned ? "Unpin" : "Pin"} Comment`,
                    action: () => {
                        setNotification({
                            open: true,
                            text: `${pinned ? "Unpin" : "Pin"}ing Comment...`,
                        });
                        (pinned
                            ? api.commentUnpin(threadId, comment.id)
                            : api.commentPin(threadId, comment.id)
                        )
                            .then(() => {
                                setNotification({
                                    open: true,
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
            icon: <FeedIcon className="font-size-19-force" />,
            title: "Create thread",
            action: () => {
                navigate(`/create?quote=${threadId}.${comment.id}`);
            },
        },
        {
            icon: <Edit className="font-size-19-force" />,
            title: "Edit comment",
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
        <div
            className={`flex align-center font-size-17 pt10 ${
                !fold ? "justify-space-between" : ""
            }`}
        >
            <PopUp
                open={open}
                setOpen={setOpen}
                title="User information"
                buttons={[{ text: "View Profile", link: `/profile/${comment.user.id}` }]}
            >
                <p className="text-align-center mt5 mb5 font-size-20">
                    {comment.user.name}
                    <br />#{comment.user.id}
                </p>
            </PopUp>
            <div
                className={`flex align-center ${
                    !fold ? "comment-tag-left" : "fullwidth"
                }`}
            >
                <Typography
                    className="novmargin font-size-17-force"
                    sx={(theme) => ({
                        color: isOp ? theme.palette.secondary.main : "#aca9a9",
                    })}
                >
                    #{comment.id}
                </Typography>
                <p
                    className="comment-tag-userlink novmargin ml10 text-overflow-ellipsis nowrap pointer overflow-hidden max-width-full"
                    onClick={() => {
                        setOpen(true);
                    }}
                    style={{
                        color: comment.user.sex === "M" ? "#34aadc" : "red",
                    }}
                >
                    {comment.user.name}
                </p>
                <Tooltip
                    title={dateAndTime.format(
                        new Date(comment.createdAt),
                        "ddd, MMM DD YYYY HH:mm:ss"
                    )}
                    arrow
                >
                    <p
                        onClick={() => {
                            if (isMobile) {
                                setTimeMode(timeMode === "short" ? "long" : "short");
                            }
                        }}
                        className={`novmargin metahkg-grey ml10 font-size-15${
                            isMobile ? " pointer" : ""
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
                    </p>
                </Tooltip>
                {fold && (
                    <Box
                        onClick={() => {
                            setFold && setFold(false);
                        }}
                        sx={{ flexGrow: 1 }}
                        className="pointer flex overflow-hidden"
                    >
                        <p className={"novmargin ml5 metahkg-grey"}>:</p>
                        <p
                            className="novmargin comment-body break-word-force ml10 nowrap overflow-hidden text-overflow-ellipsis max-width-full"
                            style={{ display: "inline-block" }}
                        >
                            {comment.text}
                        </p>
                    </Box>
                )}
                {!fold &&
                    leftBtns.map(
                        (button, index) =>
                            button && (
                                <Tooltip key={index} title={button.title} arrow>
                                    <IconButton
                                        className="ml10 nopadding"
                                        onClick={button.action}
                                    >
                                        {button.icon}
                                    </IconButton>
                                </Tooltip>
                            )
                    )}
            </div>
            <div className="flex align-center">
                {!fold &&
                    rightBtns.map((button, index) => (
                        <Tooltip key={index} title={button.title} arrow>
                            <IconButton
                                className="ml10 nopadding"
                                onClick={button.action}
                            >
                                {button.icon}
                            </IconButton>
                        </Tooltip>
                    ))}
                {!fold && <MoreList buttons={moreList} />}
            </div>
        </div>
    );
}
