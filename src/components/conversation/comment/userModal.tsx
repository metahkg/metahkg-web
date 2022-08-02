import { User } from "@metahkg/api";
import React from "react";
import { api } from "../../../lib/api";
import { parseError } from "../../../lib/parseError";
import { PopUp } from "../../../lib/popup";
import { useBlockList, useNotification, useUser } from "../../ContextProvider";

export default function UserModal(props: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    user: User;
}) {
    const { open, setOpen, user: commentUser } = props;
    const [blockList, setBlockList] = useBlockList();
    const [, setNotification] = useNotification();
    const blocked = Boolean(blockList.find((i) => i.id === commentUser.id));
    const [user] = useUser()

    return (
        <PopUp
            open={open}
            setOpen={setOpen}
            title="User information"
            buttons={[
                { text: "View Profile", link: `/profile/${commentUser.id}` },
                user ? {
                    text: blocked ? "Unblock" : "Block",
                    action: () => {
                        (blocked
                            ? api.meUnblock({ id: commentUser.id })
                            : api.meBlock({ id: commentUser.id })
                        )
                            .then(() => {
                                setNotification({
                                    open: true,
                                    text: `${blocked ? "Unblocked" : "Blocked"} ${
                                        commentUser.name
                                    }`,
                                });
                                api.meBlocked().then(setBlockList);
                            })
                            .catch((err) => {
                                setNotification({
                                    open: true,
                                    text: parseError(err),
                                });
                            });
                    },
                } : undefined,
            ]}
        >
            <p className="text-align-center mt5 mb5 font-size-20">
                {commentUser.name}
                <br />#{commentUser.id}
            </p>
        </PopUp>
    );
}
