import {
    Visibility,
    VisibilityOff,
    Reply as ReplyIcon,
    Share as ShareIcon,
    Feed as FeedIcon,
    Edit,
    PushPin,
} from "@mui/icons-material";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
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
import { useNotification, useSettings, useUser } from "../../ContextProvider";
import { api } from "../../../lib/api";
import { AxiosError } from "axios";
import React from "react";
import { parseError } from "../../../lib/parseError";
import { Comment } from "@metahkg/api";
import { filterSwearWords } from "../../../lib/filterSwear";
import UserModal from "./userModal";

export default function CommentTop(props: {
    comment: Comment;
    noStory?: boolean;
    fold?: boolean;
    setFold?: React.Dispatch<React.SetStateAction<boolean>>;
    blocked?: boolean;
    setBlocked?: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}) {
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
    const cRoot = useCRoot();

    const { comment, noStory, fold, setFold, blocked, setBlocked } = props;

    const isOp = thread && thread.op.id === comment.user.id;

    const leftBtns = useMemo(
        () => [
            (story ? story === comment.user.id : 1) &&
                !noStory && {
                    icon: story ? (
                        <VisibilityOff className="!text-metahkg-grey !text-[19px]" />
                    ) : (
                        <Visibility className="!text-metahkg-grey !text-[19px]" />
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
                                    cRoot.current.scrollTop += afterHeight - beforeHeight;
                                }
                            });
                        }
                    },
                },
            {
                icon: <ReplyIcon className="!text-metahkg-grey !text-[21px] !mb-[1px]" />,
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
        ],
        [story, comment, noStory, cRoot, setStory, user, setEditor, navigate]
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
    )[] = useMemo(
        () => [
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
                icon: <FeedIcon className="!text-[19px]" />,
                title: "Create thread",
                action: () => {
                    navigate(`/create?quote=${threadId}.${comment.id}`);
                },
            },
            {
                icon: <Edit className="!text-[19px]" />,
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
        ],
        [comment, navigate, setEditor, setNotification, setThread, thread, threadId, user]
    );

    return (
        <Box
            className={`flex items-center text-[17px] !pt-[10px] ${
                !fold ? "justify-between" : ""
            }`}
        >
            <UserModal open={open} setOpen={setOpen} user={comment.user} />
            <Box className={`flex items-center ${!fold ? "comment-tag-left" : "w-full"}`}>
                <Typography
                    className="!my-0 !text-[17px]"
                    sx={(theme) => ({
                        color: isOp ? theme.palette.secondary.main : "#aca9a9",
                    })}
                >
                    #{comment.id}
                </Typography>
                <p
                    className="comment-tag-userlink !my-0 !ml-[10px] text-overflow-ellipsis whitespace-nowrap cursor-pointer overflow-hidden max-w-full"
                    onClick={() => {
                        setOpen(true);
                    }}
                    style={{
                        color: comment.user.sex === "M" ? "#34aadc" : "red",
                        minWidth: "50px",
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
                        className={`!my-0 text-metahkg-grey !ml-[10px] text-[15px]${
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
                    </p>
                </Tooltip>
                {fold && !blocked && (
                    <Box
                        onClick={() => {
                            setFold && setFold(false);
                        }}
                        sx={{ flexGrow: 1 }}
                        className="cursor-pointer flex overflow-hidden"
                    >
                        <p className={"!my-0 !ml-[5px] text-metahkg-grey"}>:</p>
                        <p className="!my-0 comment-body !break-words !ml-[10px] whitespace-nowrap overflow-hidden text-overflow-ellipsis max-w-full inline-block">
                            {settings.filterSwearWords
                                ? filterSwearWords(comment.text)
                                : comment.text}
                        </p>
                    </Box>
                )}
                {blocked && (
                    <Tooltip arrow title="User blocked.">
                        <Button
                            sx={{ color: "grey" }}
                            className="!ml-[20px] !text-[14px] !normal-case"
                            color="error"
                            onClick={() => {
                                setBlocked && setBlocked(false);
                            }}
                            variant="outlined"
                        >
                            Click to view comment
                        </Button>
                    </Tooltip>
                )}
                {!fold &&
                    !blocked &&
                    leftBtns.map(
                        (button, index) =>
                            button && (
                                <Tooltip key={index} title={button.title} arrow>
                                    <IconButton
                                        className="!ml-[10px] !p-0"
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
                            <IconButton
                                className="!ml-[10px] !p-0"
                                onClick={button.action}
                            >
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
