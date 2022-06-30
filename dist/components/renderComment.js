import { jsx as _jsx } from "react/jsx-runtime";
import parse from "html-react-parser";
import React from "react";
export default function RenderComment(props) {
    const { comment, depth } = props;
    const commentJSX = parse(comment.comment);
    const content = [
        comment.quote && depth < 3 && (_jsx("blockquote", Object.assign({ style: {
                color: "#aca9a9",
                borderLeft: "2px solid #646262",
                marginLeft: 0,
            } }, { children: _jsx("div", Object.assign({ style: { marginLeft: 15 } }, { children: _jsx(RenderComment, { comment: comment.quote, depth: depth + 1 }) })) }))),
        commentJSX,
    ];
    return _jsx(React.Fragment, { children: content });
}
//# sourceMappingURL=renderComment.js.map