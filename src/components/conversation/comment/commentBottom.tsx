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

import React, { useRef, useState } from "react";
import { AddReaction, Forum } from "@mui/icons-material";
import { Box, Button, IconButton, Popover, Typography } from "@mui/material";
import VoteButtons from "./voteButtons";
import { api } from "../../../lib/api";
import { parseError } from "../../../lib/parseError";
import { css } from "../../../lib/css";
import { useThreadId } from "../ConversationContext";
import {
    useDarkMode,
    useIsSmallScreen,
    useNotification,
    useUser,
} from "../../AppContextProvider";
import {
    useInPopUp,
    useSetIsExpanded,
    useShowReplies,
    usePopupOpen,
    useComment,
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
    const [user] = useUser();
    const emotionBtnRef = useRef<HTMLButtonElement>(null);
    const isSmallScreen = useIsSmallScreen();
    const darkMode = useDarkMode();

    const choosed = user && comment.emotions?.find((i) => i.user === user.id)?.emotion;

    const setEmotion = (emotion: string) => {
        if (!user) return;
        setEmojiOpen(false);
        setNotification({
            open: true,
            severity: "info",
            text: "Setting emotion...",
        });
        api.commentEmotionSet(threadId, comment.id, {
            emotion,
        })
            .then(() => {
                setNotification({
                    open: true,
                    severity: "success",
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
                api.commentEmotions(threadId, comment.id).then((data) => {
                    setComment({
                        ...comment,
                        emotions: data,
                    });
                });
            })
            .catch((err) =>
                setNotification({
                    open: true,
                    severity: "error",
                    text: parseError(err),
                }),
            );
    };

    const deleteEmotion = () => {
        if (!user) return;
        api.commentEmotionDelete(threadId, comment.id).then(() => {
            setNotification({
                open: true,
                severity: "success",
                text: "Emotion deleted.",
            });
            user &&
                setComment({
                    ...comment,
                    emotions: comment.emotions
                        ? comment.emotions.filter((i) => i.user !== user.id)
                        : [],
                });
            api.commentEmotions(threadId, comment.id).then((data) => {
                setComment({
                    ...comment,
                    emotions: data,
                });
            });
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
            <Box className="flex !mx-5">
                <VoteButtons comment={comment} key={`${comment.U}${comment.D}`} />
                {comment.replies?.length && (
                    <Button
                        className={`${css.smallBtn} !ml-2 !bg-[#f6f6f6] dark:!bg-[#333]`}
                        variant="text"
                        onClick={() => {
                            if (inPopUp) {
                                setShowReplies(!showReplies);
                                setIsExpanded?.(!showReplies);
                            } else setPopupOpen(true);
                        }}
                    >
                        <Forum className="!text-sm hover:text-black dark:hover:text-white" />
                        <Typography className="!ml-1 text-metahkg-grey">
                            {comment.replies?.length}
                        </Typography>
                    </Button>
                )}
            </Box>
            <Box className="flex items-center">
                {emotions && Boolean(emotions?.length) && (
                    <React.Fragment>
                        <Box className="flex items-center">
                            {emotions
                                .slice(0, isSmallScreen ? 1 : 3)
                                .map((item, index) => {
                                    const isChoosed = choosed === item.emotion;
                                    return (
                                        <Button
                                            className={`${css.smallBtn} !mx-1`}
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
                            className="!text-metahkg-grey !mx-2"
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
                                    theme={darkMode ? "dark" : "light"}
                                />
                            </Box>
                        </Popover>
                    </React.Fragment>
                )}
            </Box>
        </Box>
    );
}
