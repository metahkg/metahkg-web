import "./css/comment.css";
import React from "react";
import { commentType } from "../../types/conversation/comment";
/**
 * Comment component renders a comment
 * which includes a title (Tag)
 * the comment body
 * and upvote and downvote buttons
 */
declare function Comment(props: {
    comment: commentType;
    noId?: boolean;
    inPopUp?: boolean;
    showReplies?: boolean;
    fetchComment?: boolean;
    noQuote?: boolean;
    setIsExpanded?: React.Dispatch<React.SetStateAction<boolean>>;
    fold?: boolean;
    openComment?: boolean;
    blocked?: boolean;
    noStory?: boolean;
    scrollIntoView?: boolean;
}): JSX.Element;
declare const _default: React.MemoExoticComponent<typeof Comment>;
export default _default;
