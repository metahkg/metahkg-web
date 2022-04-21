import parse from "html-react-parser";
import React from "react";
import { commentType } from "../types/conversation/comment";

export default function RenderComment(props: { comment: commentType; depth: number }) {
    const { comment, depth } = props;
    const commentJSX = parse(comment.comment);
    const content = [
        comment.quote && depth < 4 && (
            <blockquote
                style={{
                    color: "#aca9a9",
                    borderLeft: "2px solid #646262",
                    marginLeft: 0,
                }}
            >
                <div style={{ marginLeft: 15 }}>
                    <RenderComment comment={comment.quote} depth={depth + 1} />
                </div>
            </blockquote>
        ),
        commentJSX,
    ];
    return <React.Fragment>{content}</React.Fragment>;
}
