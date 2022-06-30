import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./css/commentBody.css";
import { replace } from "../../../lib/modifycomments";
import parse from "html-react-parser";
import React, { useEffect, useState } from "react";
import Prism from "prismjs";
import { Box, Button } from "@mui/material";
import CommentPopup from "../../../lib/commentPopup";
export default function CommentBody(props) {
    const { comment, depth, noQuote } = props;
    const commentJSX = parse(comment.comment, { replace: replace });
    const [quoteOpen, setQuoteOpen] = useState(false);
    const [showQuote, setShowQuote] = useState(!(depth && depth % 4 === 0));
    const content = [
        comment.quote && !noQuote && (_jsxs("blockquote", Object.assign({ style: { border: "none" }, className: `flex fullwidth${depth !== 0 ? " novmargin" : ""}` }, { children: [_jsx(Box, { className: `${showQuote ? "pointer " : ""}comment-body-quote-div nopadding metahkg-grey ml0`, sx: (theme) => ({
                        width: 15,
                        "&:hover": {
                            borderLeft: showQuote && `2px solid ${theme.palette.secondary.main}`,
                        },
                    }), onClick: () => {
                        showQuote && setQuoteOpen(true);
                    } }), showQuote ? (_jsx("div", Object.assign({ className: "comment-body fullwidth" }, { children: _jsx(CommentBody, { comment: comment.quote, depth: depth + 1 }) }))) : (_jsx(Button, Object.assign({ variant: "outlined", sx: {
                        border: "1px solid #aca6a6",
                        "&:hover": {
                            border: "1px solid #aca6a6",
                            background: "rgba(255, 255, 255, 0.1)",
                        },
                    }, className: "metahkg-grey-force notexttransform pt3 pb3 pl5 pr5", onClick: () => {
                        setShowQuote(true);
                    } }, { children: "Show more" })))] }), depth)),
        commentJSX,
    ];
    useEffect(() => {
        Prism.highlightAll();
    });
    return (_jsxs(React.Fragment, { children: [comment.quote && showQuote && (_jsx(CommentPopup, { open: quoteOpen, setOpen: setQuoteOpen, comment: comment.quote, fetchComment: true })), depth === 0 ? (_jsx("p", Object.assign({ className: "novmargin comment-body fullwidth break-word-force" }, { children: content }))) : (content)] }));
}
//# sourceMappingURL=commentBody.js.map