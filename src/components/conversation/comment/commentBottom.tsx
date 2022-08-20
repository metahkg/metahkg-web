import React, { useRef, useState } from "react";
import { AddReaction, EscalatorOutlined, Forum, MoreHoriz } from "@mui/icons-material";
import {
    Box,
    Button,
    IconButton,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
    Paper,
    Popover,
} from "@mui/material";
import EmojiPicker from "emoji-picker-react";
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
    useOpenComment,
    useComment,
    useReFetch,
} from "../comment";

export default function CommentBottom() {
    const [emojiOpen, setEmojiOpen] = useState(false);
    const [openAdditional, setOpenAdditional] = useState(false);
    const threadId = useThreadId();
    const [, setNotification] = useNotification();
    const inPopUp = useInPopUp();
    const [showReplies, setShowReplies] = useShowReplies();
    const setIsExpanded = useSetIsExpanded();
    const [, setPopupOpen] = usePopupOpen();
    const openComment = useOpenComment();
    const [comment, setComment] = useComment();
    const [, setReFetch] = useReFetch();
    const [user] = useUser();
    const emotionBtnRef = useRef<HTMLButtonElement>(null);
    const moreBtnRef = useRef<HTMLButtonElement>(null);

    const choosed = user && comment.emotions?.find((i) => i.user === user.id)?.emotion;

    const setEmotion = (emotion: string) => {
        if (!user) return;
        setEmojiOpen(false);
        setNotification({
            open: true,
            text: "Setting emotion...",
        });
        api.commentEmotion(threadId, comment.id, {
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

    const emotions = comment.emotions
        ?.reduce((prev, curr) => {
            if (!prev.includes(curr.emotion)) prev.push(curr.emotion);
            return prev;
        }, [] as string[])
        .map((emotion) => ({
            emotion,
            count: comment.emotions?.filter((x) => x.emotion === emotion).length || 0,
        }))
        .sort((a, b) => b.count - a.count);

    return (
        <Box className="flex justify-between items-center w-full">
            <Box className="flex !ml-[20px] !mr-[20px]">
                <VoteButtons comment={comment} key={`${comment.U}${comment.D}`} />
                {comment.replies?.length && (
                    <Button
                        className={`${css.smallBtn} !bg-[#333]`}
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
                {emotions && (
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
                        {emotions.length > 3 && (
                            <Box>
                                <IconButton
                                    onClick={() => {
                                        setOpenAdditional(true);
                                    }}
                                    ref={moreBtnRef}
                                    className="!mx-[5px]"
                                >
                                    <MoreHoriz />
                                </IconButton>
                                <Popover
                                    open={openAdditional}
                                    onClose={() => {
                                        setOpenAdditional(false);
                                    }}
                                    anchorEl={moreBtnRef.current}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "right",
                                    }}
                                >
                                    <Paper>
                                        <MenuList>
                                            {emotions.slice(3).map((emotion, index) => {
                                                const isChoosed =
                                                    choosed === emotion.emotion;
                                                return (
                                                    <MenuItem
                                                        key={index}
                                                        onClick={() => {
                                                            setOpenAdditional(false);
                                                            setPopupOpen(false);
                                                            isChoosed
                                                                ? deleteEmotion()
                                                                : setEmotion(
                                                                      emotion.emotion
                                                                  );
                                                        }}
                                                        {...(isChoosed && {
                                                            color: "secondary",
                                                        })}
                                                    >
                                                        <ListItemIcon>
                                                            {emotion.emotion}
                                                        </ListItemIcon>
                                                        <ListItemText>
                                                            {emotion.count}
                                                        </ListItemText>
                                                    </MenuItem>
                                                );
                                            })}
                                        </MenuList>
                                    </Paper>
                                </Popover>
                            </Box>
                        )}
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
                                horizontal: "right",
                            }}
                            anchorEl={emotionBtnRef.current}
                        >
                            <EmojiPicker
                                onEmojiClick={(_event, emotion) => {
                                    setEmotion(emotion.emoji);
                                }}
                            />
                        </Popover>
                    </React.Fragment>
                )}
                {openComment && (
                    <a
                        href={`/thread/${threadId}?c=${comment.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex !text-metahkg-grey !mr-[10px] !no-underline"
                    >
                        <EscalatorOutlined />
                        Open Comment
                    </a>
                )}
            </Box>
        </Box>
    );
}
