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

import { User } from "@metahkg/api";
import { Box, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { api } from "../../../lib/api";
import { parseError } from "../../../lib/parseError";
import { PopUp } from "../../../lib/popup";
import { useBlockList, useNotification, useUser } from "../../AppContextProvider";

export default function UserModal(props: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    user: User;
}) {
    const { open, setOpen, user: commentUser } = props;
    const [blockList, setBlockList] = useBlockList();
    const [, setNotification] = useNotification();
    const blocked = Boolean(blockList.find((i) => i.id === commentUser.id));
    const [user] = useUser();
    const [blockModalOpen, setBlockModalOpen] = useState(false);
    const [reason, setReason] = useState("");

    return (
        <PopUp
            open={open}
            setOpen={setOpen}
            title="User information"
            buttons={[
                { text: "View Profile", link: `/profile/${commentUser.id}` },
                user
                    ? {
                          text: blocked ? "Unblock" : "Block",
                          action: () => {
                              if (!blocked) return setBlockModalOpen(true);

                              setNotification({ open: true, text: "Unblocking user..." });
                              api.userUnblock(commentUser.id)
                                  .then(() => {
                                      setNotification({
                                          open: true,
                                          severity: "success",
                                          text: `Unblocked ${commentUser.name}`,
                                      });
                                      setBlockList(
                                          blockList.filter((i) => i.id !== commentUser.id)
                                      );
                                      api.meBlocked().then(setBlockList);
                                  })
                                  .catch((err) => {
                                      setNotification({
                                          open: true,
                                          severity: "error",
                                          text: parseError(err),
                                      });
                                  });
                          },
                      }
                    : undefined,
            ]}
        >
            <PopUp
                open={blockModalOpen}
                setOpen={setBlockModalOpen}
                title="Block user"
                buttons={[
                    { text: "Cancel", action: () => setBlockModalOpen(false) },
                    {
                        text: "Block",
                        action: () => {
                            setNotification({ open: true, text: "Blocking user..." });
                            api.userBlock(commentUser.id, { reason })
                                .then(() => {
                                    setNotification({
                                        open: true,
                                        severity: "success",
                                        text: `Blocked ${commentUser.name}`,
                                    });
                                    setBlockList([
                                        ...blockList,
                                        { ...commentUser, date: new Date(), reason },
                                    ]);
                                    api.meBlocked().then(setBlockList);
                                    setBlockModalOpen(false);
                                })
                                .catch((err) => {
                                    setNotification({
                                        open: true,
                                        severity: "error",
                                        text: parseError(err),
                                    });
                                });
                        },
                    },
                ]}
            >
                <Box className="mx-2 mb-2">
                    <Typography className="text-center !my-2 !text-xl">
                        {commentUser.name}
                    </Typography>
                    <Typography className="text-center !my-2 !text-xl">
                        #{commentUser.id}
                    </Typography>
                    <TextField
                        onChange={(e) => setReason(e.target.value)}
                        label="Reason to block (optional)"
                        variant="outlined"
                        fullWidth
                        color="secondary"
                        helperText="This can help you to find out why you blocked this user"
                    />
                </Box>
            </PopUp>
            <Typography className="text-center !my-1 !text-xl">
                {commentUser.name}
                <br />#{commentUser.id}
            </Typography>
        </PopUp>
    );
}
