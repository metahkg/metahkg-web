import React, { SetStateAction, useState } from "react";
import { useIsSmallScreen } from "../components/ContextProvider";
import Comment from "../components/conversation/comment";
import { PopUp } from "./popup";
import { Comment as CommentType } from "@metahkg/api";

export default function CommentPopup(props: {
    open: boolean;
    setOpen: React.Dispatch<SetStateAction<boolean>>;
    showReplies?: boolean;
    comment: CommentType;
    fetchComment?: boolean;
    openComment?: boolean;
}) {
    const { open, setOpen, comment, showReplies, fetchComment, openComment } = props;
    const [isExpanded, setIsExpanded] = useState(!!showReplies);
    const isSmallScreen = useIsSmallScreen();
    return (
        <PopUp
            open={open}
            setOpen={setOpen}
            fullWidth
            closeBtn={isExpanded}
            className={`${isExpanded ? "height-fullvh" : ""} novmargin noshadow ${
                isSmallScreen ? "nohmargin fullwidth-force" : ""
            }`}
            sx={{
                maxHeight: "none !important",
                bgcolor: isExpanded ? "primary.dark" : "transparent",
            }}
        >
            <Comment
                comment={comment}
                noId
                fetchComment={fetchComment}
                inPopUp
                setIsExpanded={setIsExpanded}
                showReplies={showReplies}
                openComment={openComment}
            />
        </PopUp>
    );
}
