import {
    Visibility,
    VisibilityOff,
    Reply as ReplyIcon,
    Share as ShareIcon,
    Feed as FeedIcon,
    Edit,
    PushPin,
} from "@mui/icons-material";
import { IconButton, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PopUp } from "../../../lib/popup";
import { commentType } from "../../../types/conversation/comment";
import {
    useCRoot,
    useStory,
    useThread,
    useThreadId,
    useTitle,
} from "../ConversationContext";
import { useShareLink, useShareOpen, useShareTitle } from "../ShareProvider";
import dateat from "date-and-time";
import { isMobile } from "react-device-detect";
import { timetoword } from "../../../lib/common";
import MoreList from "./more";
import { useNotification } from "../../ContextProvider";
import { api } from "../../../lib/api";
import { AxiosError } from "axios";
export default function CommentTop(props: { comment: commentType }) {
    const [open, setOpen] = useState(false);
    const [timemode, setTimemode] = useState<"short" | "long">("short");
    const [, setShareLink] = useShareLink();
    const [, setShareTitle] = useShareTitle();
    const [, setShareOpen] = useShareOpen();
    const [story, setStory] = useStory();
    const [, setNotification] = useNotification();
    const threadId = useThreadId();
    const title = useTitle();
    const navigate = useNavigate();
    const [thread, setThread] = useThread();
    const croot = useCRoot();
    const { comment } = props;
    const isOp = thread && thread.op.id === comment.user.id;
    const leftbtns = [
        {
            icon: story ? (
                <VisibilityOff className="metahkg-grey-force font-size-19-force" />
            ) : (
                <Visibility className="metahkg-grey-force font-size-19-force" />
            ),
            title: story ? "Quit story mode" : "Story mode",
            action: () => {
                const beforeHeight =
                    //@ts-ignore
                    document.getElementById(`c${id}`)?.offsetTop -
                    47 -
                    //@ts-ignore
                    croot.current?.scrollTop;
                setStory(story ? 0 : comment.user.id);
                setTimeout(() => {
                    const afterHeight =
                        //@ts-ignore
                        document.getElementById(`c${id}`)?.offsetTop -
                        47 -
                        //@ts-ignore
                        croot.current?.scrollTop;
                    //@ts-ignore
                    croot.current.scrollTop += afterHeight - beforeHeight;
                });
            },
        },
        {
            icon: <ReplyIcon className="metahkg-grey-force font-size-21-force mb1" />,
            title: "Quote",
            action: () => {
                navigate(`/comment/${threadId}?quote=${comment.id}`);
            },
        },
    ];
    const rightbtns: {
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
            const clientIsOp =
                thread && Number(localStorage.getItem("id")) === thread.op.id;
            if (clientIsOp) {
                const pinned = thread.pin?.id === comment.id;
                const onError = (err: AxiosError) => {
                    setNotification({
                        open: true,
                        text: err.response?.data?.error || err.response?.data || "",
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
                        api.post(`/posts/${pinned ? "un" : ""}pin`, {
                            id: threadId,
                            cid: pinned ? undefined : comment.id,
                        })
                            .then(() => {
                                setNotification({
                                    open: true,
                                    text: `Comment ${pinned ? "un" : ""}pinned!`,
                                });
                                setThread({
                                    ...thread,
                                    pin: pinned ? undefined : comment,
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
            title: "Create new topic",
            action: () => {
                navigate(`/create?quote=${threadId}.${comment.id}`);
            },
        },
        {
            icon: <Edit className="font-size-19-force" />,
            title: "Edit comment",
            action: () => {
                navigate(`/comment/${threadId}?edit=${comment.id}`);
            },
        },
    ];
    return (
        <div className="flex align-center font-size-17 pt10 justify-space-between">
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
            <div className="flex align-center comment-tag-left">
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
                    title={dateat.format(
                        new Date(comment.createdAt),
                        "ddd, MMM DD YYYY HH:mm:ss"
                    )}
                    arrow
                >
                    <p
                        onClick={() => {
                            if (isMobile) {
                                setTimemode(timemode === "short" ? "long" : "short");
                            }
                        }}
                        className={`novmargin metahkg-grey ml10 font-size-15${
                            isMobile ? " pointer" : ""
                        }`}
                    >
                        {
                            {
                                short: timetoword(comment.createdAt),
                                long: dateat.format(
                                    new Date(comment.createdAt),
                                    "DD/MM/YY HH:mm"
                                ),
                            }[timemode]
                        }
                    </p>
                </Tooltip>
                {leftbtns.map((button, index) => (
                    <Tooltip key={index} title={button.title} arrow>
                        <IconButton className="ml10 nopadding" onClick={button.action}>
                            {button.icon}
                        </IconButton>
                    </Tooltip>
                ))}
            </div>
            <div className="flex align-center">
                {rightbtns.map((button) => (
                    <Tooltip title={button.title} arrow>
                        <IconButton className="ml10 nopadding" onClick={button.action}>
                            {button.icon}
                        </IconButton>
                    </Tooltip>
                ))}
                <MoreList buttons={moreList} />
            </div>
        </div>
    );
}
