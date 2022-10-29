import { User } from "@metahkg/api";
import { Box, TextField } from "@mui/material";
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
                <Box className="mx-[10px] mb-[10px]">
                    <p className="text-center my-2 text-[20px]">{commentUser.name}</p>
                    <p className="text-center my-2 text-[20px]">#{commentUser.id}</p>
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
            <p className="text-center !mt-[5px] !mb-[5px] text-[20px]">
                {commentUser.name}
                <br />#{commentUser.id}
            </p>
        </PopUp>
    );
}
