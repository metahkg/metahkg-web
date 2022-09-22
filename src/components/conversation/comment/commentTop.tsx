import {
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Reply as ReplyIcon,
    Share as ShareIcon,
    Feed as FeedIcon,
    Edit as EditIcon,
    PushPin as PushPinIcon,
} from "@mui/icons-material";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
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
    useBlockList,
    useNotification,
    useSettings,
    useUser,
} from "../../ContextProvider";
import { api } from "../../../lib/api";
import { AxiosError } from "axios";
import React from "react";
import { parseError } from "../../../lib/parseError";
import { Comment } from "@metahkg/api";
import { filterSwearWords } from "../../../lib/filterSwear";
import UserModal from "./userModal";
import { colors } from "../../../lib/css";
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
                        <ReplyIcon className="!text-metahkg-grey !text-[21px] !mb-[1px]" />
                    ),
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
                user?.role === "admin" && inThread && {
                    icon: (
                        <EditIcon className="!text-metahkg-grey !text-[18px] !mb-[1px]" />
                    ),
                    title: "Edit (Admin)",
                    action: () => {
                        setEditing((editing) => !editing);
                    },
                },
            ].filter((x) => x),
        [story, comment, noStory, user, inThread, cRoot, setStory, setEditor, navigate, setEditing]
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
        <Box
            className={`flex items-center text-[17px] !pt-[10px] ${
                !fold ? "justify-between" : ""
            }`}
        >
            <UserModal open={open} setOpen={setOpen} user={comment.user} />
            <Box
                className={`flex items-center ${
                    !fold ? "max-w-[calc(100%-75px)]" : "w-full"
                }`}
            >
                <Typography
                    className="!my-0 !text-[17px]"
                    sx={(theme) => ({
                        color: isOp ? theme.palette.secondary.main : colors.grey,
                    })}
                >
                    #{comment.id}
                </Typography>
                <p
                    className={`leading-[22px] max-h-[22px] !my-0 !ml-[10px] text-ellipsis whitespace-nowrap cursor-pointer overflow-hidden max-w-full ${
                        comment.user.name.length > 5 || fold || blocked
                            ? "min-w-[50px]"
                            : ""
                    } hover:underline`}
                    onClick={() => {
                        setOpen(true);
                    }}
                    style={{
                        color: comment.user.sex === "M" ? colors.blue : "red",
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
                            if (isMobile)
                                setTimeMode(timeMode === "short" ? "long" : "short");
                        }}
                        className={`!my-0 text-metahkg-grey !ml-[7px] text-[15px]${
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
                        <p className="!my-0 comment-body !break-words !ml-[10px] whitespace-nowrap overflow-hidden text-ellipsis max-w-full inline-block">
                            {settings.filterSwearWords
                                ? filterSwearWords(comment.text)
                                : comment.text}
                        </p>
                    </Box>
                )}
                {blocked && (
                    <BlockedBtn
                        className="!ml-[20px]"
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
