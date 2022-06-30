/// <reference types="react" />
import "./css/commentBody.css";
import { commentType } from "../../../types/conversation/comment";
export default function CommentBody(props: {
    comment: commentType;
    depth: number;
    noQuote?: boolean;
}): JSX.Element;
