/// <reference types="react" />
import { commentType } from "../types/conversation/comment";
export default function RenderComment(props: {
    comment: commentType;
    depth: number;
}): JSX.Element;
