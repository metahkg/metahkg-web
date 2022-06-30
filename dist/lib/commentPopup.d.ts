import React, { SetStateAction } from "react";
import { commentType } from "../types/conversation/comment";
export default function CommentPopup(props: {
    open: boolean;
    setOpen: React.Dispatch<SetStateAction<boolean>>;
    showReplies?: boolean;
    comment: commentType;
    fetchComment?: boolean;
    openComment?: boolean;
}): JSX.Element;
