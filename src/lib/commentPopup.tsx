import React, { SetStateAction, useState } from "react";
import { useIsSmallScreen } from "../components/AppContextProvider";
import Comment from "../components/conversation/comment";
import { PopUp } from "./popup";
import { Comment as CommentType } from "@metahkg/api";

export default function CommentPopup(props: {
    open: boolean;
    setOpen: React.Dispatch<SetStateAction<boolean>>;
    showReplies?: boolean;
    comment: CommentType;
    fetchComment?: boolean;
}) {
    const { open, setOpen, comment, showReplies, fetchComment } = props;
    const [isExpanded, setIsExpanded] = useState(Boolean(showReplies));
    const isSmallScreen = useIsSmallScreen();
    return (
        <PopUp
            open={open}
            setOpen={setOpen}
            fullWidth
            closeBtn={isExpanded}
            className={`${isExpanded ? "h-screen" : ""} !my-0 !shadow-none ${
                isSmallScreen ? "!mx-0 !w-full" : ""
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
            />
        </PopUp>
    );
}
