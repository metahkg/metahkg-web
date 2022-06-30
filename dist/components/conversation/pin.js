import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { InfoOutlined } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import CommentPopup from "../../lib/commentPopup";
export default function PinnedComment(props) {
    const { comment } = props;
    const [open, setOpen] = useState(false);
    return (_jsxs(React.Fragment, { children: [_jsx(CommentPopup, { comment: comment, open: open, setOpen: setOpen, fetchComment: true }), _jsxs(Box, Object.assign({ sx: { bgcolor: "primary.dark", height: 50 }, className: "flex fullwidth align-center pointer", onClick: () => {
                    setOpen(true);
                } }, { children: [_jsx(InfoOutlined, { className: "metahkg-grey-force ml10 mr10" }), _jsxs("div", Object.assign({ className: "overflow-hidden" }, { children: [_jsxs(Typography, Object.assign({ className: "novmargin", color: "secondary" }, { children: ["Pinned Comment #", comment.id] })), _jsx(Typography, Object.assign({ className: "metahkg-grey-force text-overflow-ellipsis overflow-hidden nowrap novmargin mr15" }, { children: comment.text }))] }))] }))] }));
}
//# sourceMappingURL=pin.js.map