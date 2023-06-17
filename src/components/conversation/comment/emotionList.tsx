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
    Divider,
    Typography,
} from "@mui/material";
import { useComment, usePopupOpen } from "../comment";
import { User } from "@metahkg/api";
import { Link } from "react-router-dom";
import { api } from "../../../lib/api";
import { useThreadId } from "../ConversationContext";
import Loader from "../../../lib/loader";
import UserAvatar from "../../UserAvatar";

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

    function UserItem(props: { user: User }) {
        const { user } = props;

        return (
            <MenuItem
                component={Link}
                to={`/profile/${user.id}`}
                className="!text-inherit"
            >
                <ListItemIcon>
                    <UserAvatar user={user} className="!h-[25px] !w-[25px] mr-[5px]" />
                </ListItemIcon>
                <ListItemText>{user.name}</ListItemText>
            </MenuItem>
        );
    }

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
                        <Typography className="ml-[5px]">{emotion}</Typography>
                    </Box>
                    <Divider />
                    <MenuList>
                        {users ? (
                            users.map((user, index) => (
                                <UserItem key={index} user={user} />
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
