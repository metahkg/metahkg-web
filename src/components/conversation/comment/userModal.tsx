import { CommentC } from "@metahkg/api";
import React from "react";
import { api } from "../../../lib/api";
import { parseError } from "../../../lib/parseError";
import { PopUp } from "../../../lib/popup";
import { useBlockList, useNotification } from "../../ContextProvider";

export default function UserModal(props: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    comment: CommentC;
}) {
    const { open, setOpen, comment } = props;
    const [blockList, setBlockList] = useBlockList();
    const [, setNotification] = useNotification();
    const blocked = Boolean(blockList.find((i) => i.id === comment.user.id));

    return (
        <PopUp
            open={open}
            setOpen={setOpen}
            title="User information"
            buttons={[
                { text: "View Profile", link: `/profile/${comment.user.id}` },
                {
                    text: blocked ? "Unblock" : "Block",
                    action: () => {
                        (blocked
                            ? api.meUnblock({ id: comment.user.id })
                            : api.meBlock({ id: comment.user.id })
                        )
                            .then(() => {
                                setNotification({
                                    open: true,
                                    text: `${blocked ? "Unblocked" : "Blocked"} ${
                                        comment.user.name
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
                },
            ]}
        >
            <p className="text-align-center mt5 mb5 font-size-20">
                {comment.user.name}
                <br />#{comment.user.id}
            </p>
        </PopUp>
    );
}
