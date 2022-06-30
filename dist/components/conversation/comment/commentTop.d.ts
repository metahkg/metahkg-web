/// <reference types="react" />
import { commentType } from "../../../types/conversation/comment";
export default function CommentTop(props: {
    comment: commentType;
    noStory?: boolean;
    fold?: boolean;
}): JSX.Element;
