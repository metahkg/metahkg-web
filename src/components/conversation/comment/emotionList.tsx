import React, { useState, useRef, useEffect } from "react";
import { ArrowBack, MoreHoriz } from "@mui/icons-material";
import {
    Box,
    IconButton,
    Popover,
    Paper,
    MenuList,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Avatar,
    Divider,
} from "@mui/material";
import { useComment, usePopupOpen } from "../comment";
import { User } from "@metahkg/api";
import { Link } from "react-router-dom";
import { api } from "../../../lib/api";
import { useThreadId } from "../ConversationContext";
import Loader from "../../../lib/loader";

export default function EmotionList(props: {
    emotions: { emotion: string; count: number }[];
}) {
    const { emotions } = props;
    const [openAdditional, setOpenAdditional] = useState(false);
    const [emotion, setEmotion] = useState("");
    const moreBtnRef = useRef<HTMLButtonElement>(null);
    const [, setPopupOpen] = usePopupOpen();
    const [users, setUsers] = useState<User[] | null>(null);
    const threadId = useThreadId();
    const [comment] = useComment();

    useEffect(() => {
        if (!emotion) setUsers(null);
        if (emotion && !users) {
            api.commentEmotionUsers(threadId, comment.id, emotion).then(setUsers);
        }
    }, [comment.id, emotion, threadId, users]);

    const handleUsersClose = () => {
        setEmotion("");
        setOpenAdditional(true);
    };

    return (
        <Box>
            <IconButton
                onClick={() => {
                    setOpenAdditional(true);
                }}
                ref={moreBtnRef}
                className="!mx-[5px] !text-metahkg-grey"
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
                    horizontal: "left",
                }}
            >
                <Paper>
                    <MenuList>
                        {emotions.map((emotion, index) => (
                            <MenuItem
                                key={index}
                                onClick={() => {
                                    setOpenAdditional(false);
                                    setPopupOpen(false);
                                    setEmotion(emotion.emotion);
                                }}
                            >
                                <ListItemIcon>{emotion.emotion}</ListItemIcon>
                                <ListItemText>{emotion.count}</ListItemText>
                            </MenuItem>
                        ))}
                    </MenuList>
                </Paper>
            </Popover>
            <Popover
                open={Boolean(emotion)}
                onClose={handleUsersClose}
                anchorEl={moreBtnRef.current}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                <Paper className="flex flex-col">
                    <Box className="flex items-center">
                        <IconButton onClick={handleUsersClose}>
                            <ArrowBack />
                        </IconButton>
                        <p className="my-0 ml-[5px]">{emotion}</p>
                    </Box>
                    <Divider />
                    <MenuList>
                        {users ? (
                            users.map((user, index) => (
                                <MenuItem
                                    key={index}
                                    component={Link}
                                    to={`/profile/${user.id}`}
                                >
                                    <ListItemIcon>
                                        <Avatar
                                            alt={user.name}
                                            src={`/api/users/${user.id}/avatar`}
                                            className="!h-[25px] !w-[25px] mr-[5px]"
                                        />
                                    </ListItemIcon>
                                    <ListItemText>{user.name}</ListItemText>
                                </MenuItem>
                            ))
                        ) : (
                            <Loader
                                position="center"
                                className="!my[5px] mx-[5px]"
                                size={30}
                            />
                        )}
                    </MenuList>
                </Paper>
            </Popover>
        </Box>
    );
}
