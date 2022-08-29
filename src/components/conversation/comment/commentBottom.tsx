import React, { useRef, useState } from "react";
import { AddReaction, Forum } from "@mui/icons-material";
import { Box, Button, IconButton, Popover } from "@mui/material";
import VoteButtons from "./voteButtons";
import { api } from "../../../lib/api";
import { parseError } from "../../../lib/parseError";
import { css } from "../../../lib/css";
import { useThreadId } from "../ConversationContext";
import { useNotification, useUser } from "../../ContextProvider";
import {
    useInPopUp,
    useSetIsExpanded,
    useShowReplies,
    usePopupOpen,
    useComment,
    useReFetch,
} from "../comment";
import EmotionList from "./emotionList";
import loadable from "@loadable/component";

const EmojiMart = loadable(() => import("../../../lib/emoji-mart/react"));

export default function CommentBottom() {
    const [emojiOpen, setEmojiOpen] = useState(false);
    const threadId = useThreadId();
    const [, setNotification] = useNotification();
    const inPopUp = useInPopUp();
    const [showReplies, setShowReplies] = useShowReplies();
    const setIsExpanded = useSetIsExpanded();
    const [, setPopupOpen] = usePopupOpen();
    const [comment, setComment] = useComment();
    const [, setReFetch] = useReFetch();
    const [user] = useUser();
    const emotionBtnRef = useRef<HTMLButtonElement>(null);

    const choosed = user && comment.emotions?.find((i) => i.user === user.id)?.emotion;

    const setEmotion = (emotion: string) => {
        if (!user) return;
        setEmojiOpen(false);
        setNotification({
            open: true,
            text: "Setting emotion...",
        });
        api.commentEmotionSet(threadId, comment.id, {
            emotion,
        })
            .then(() => {
                setNotification({
                    open: true,
                    text: "Emotion set!",
                });
                user &&
                    setComment({
                        ...comment,
                        emotions: comment.emotions
                            ? [
                                  ...comment.emotions.filter((i) => i.user !== user.id),
                                  { user: user?.id, emotion },
                              ]
                            : [{ user: user?.id, emotion }],
                    });
                setReFetch(true);
            })
            .catch((err) =>
                setNotification({
                    open: true,
                    text: parseError(err),
                })
            );
    };

    const deleteEmotion = () => {
        if (!user) return;
        api.commentEmotionDelete(threadId, comment.id).then(() => {
            setNotification({
                open: true,
                text: "Emotion deleted.",
            });
            user &&
                setComment({
                    ...comment,
                    emotions: comment.emotions
                        ? comment.emotions.filter((i) => i.user !== user.id)
                        : [],
                });
            setReFetch(true);
        });
    };

    let emotions = comment.emotions
        ?.reduce((prev, curr) => {
            if (!prev.includes(curr.emotion)) prev.push(curr.emotion);
            return prev;
        }, [] as string[])
        .map((emotion) => ({
            emotion,
            count: comment.emotions?.filter((x) => x.emotion === emotion).length || 0,
        }))
        .sort((a, b) => b.count - a.count);

    const userEmotionIndex = emotions?.findIndex((i) => i.emotion === choosed);

    if (userEmotionIndex && emotions && userEmotionIndex > 2)
        emotions = [
            ...emotions.slice(0, 2),
            emotions[userEmotionIndex],
            ...emotions.slice(2).filter((i) => i.emotion !== choosed),
        ];

    return (
        <Box className="flex justify-between items-center w-full">
            <Box className="flex !ml-[20px] !mr-[20px]">
                <VoteButtons comment={comment} key={`${comment.U}${comment.D}`} />
                {comment.replies?.length && (
                    <Button
                        className={`${css.smallBtn} !ml-[10px] !bg-[#333]`}
                        variant="text"
                        onClick={() => {
                            if (inPopUp) {
                                setShowReplies(!showReplies);
                                setIsExpanded?.(!showReplies);
                            } else setPopupOpen(true);
                        }}
                    >
                        <Forum
                            sx={{
                                "&:hover": {
                                    color: "white",
                                },
                            }}
                            className="!text-[14px]"
                        />
                        <p className="!ml-[5px] !my-0 text-metahkg-grey">
                            {comment.replies?.length}
                        </p>
                    </Button>
                )}
            </Box>
            <Box className="flex items-center">
                {emotions && Boolean(emotions?.length) && (
                    <React.Fragment>
                        <Box className="flex items-center">
                            {emotions.slice(0, 3).map((item, index) => {
                                const isChoosed = choosed === item.emotion;
                                return (
                                    <Button
                                        className={`${css.smallBtn} !mx-[5px]`}
                                        key={index}
                                        onClick={() => {
                                            isChoosed
                                                ? deleteEmotion()
                                                : setEmotion(item.emotion);
                                        }}
                                        color="secondary"
                                        variant={isChoosed ? "outlined" : "text"}
                                    >
                                        {item.emotion} {item.count}
                                    </Button>
                                );
                            })}
                        </Box>
                        <EmotionList emotions={emotions} />
                    </React.Fragment>
                )}
                {user && (
                    <React.Fragment>
                        <IconButton
                            onClick={() => {
                                setEmojiOpen(true);
                            }}
                            className="!text-metahkg-grey !mx-[10px]"
                            ref={emotionBtnRef}
                        >
                            <AddReaction />
                        </IconButton>
                        <Popover
                            open={emojiOpen}
                            onClose={() => {
                                setEmojiOpen(false);
                            }}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            anchorEl={emotionBtnRef.current}
                        >
                            <Box className="w-[352px] h-[435px] bg-transparent">
                                <EmojiMart
                                    onEmojiSelect={(emoji) => {
                                        setEmotion(emoji.native);
                                    }}
                                    theme={"dark"}
                                />
                            </Box>
                        </Popover>
                    </React.Fragment>
                )}
            </Box>
        </Box>
    );
}