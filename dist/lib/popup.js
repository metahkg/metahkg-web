import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { Close } from "@mui/icons-material";
import { Button, Dialog, DialogContent, DialogTitle, Divider, IconButton, } from "@mui/material";
import { Link } from "react-router-dom";
export function PopUp(props) {
    const { title, open, setOpen, buttons, children, fullScreen, fullWidth, sx, className, closeBtn, } = props;
    const handleClose = () => {
        setOpen(false);
    };
    return (_jsxs(Dialog, Object.assign({ open: open, fullScreen: fullScreen, PaperProps: {
            sx: Object.assign({ backgroundImage: "none", bgcolor: "primary.main" }, sx),
            className: className,
        }, fullWidth: fullWidth, onClose: handleClose }, { children: [(title || closeBtn) && (_jsxs(React.Fragment, { children: [_jsxs(DialogTitle, Object.assign({ sx: { minWidth: 270, bgcolor: "primary.main" }, className: "pr0 pl0 flex pt5 pb5 justify-space-between align-center" }, { children: [_jsx("p", Object.assign({ className: "ml20 novmargin" }, { children: title })), _jsx(IconButton, Object.assign({ className: "mr5", onClick: handleClose }, { children: _jsx(Close, { className: "font-size-18-force" }) }))] })), _jsx(Divider, {})] })), _jsxs(DialogContent, Object.assign({ className: "nopadding" }, { children: [_jsx("div", Object.assign({ className: `fullwidth flex flex-dir-column justify-center text-align-center ${title ? "mt5" : ""} ${(buttons === null || buttons === void 0 ? void 0 : buttons.length) ? "mb5" : ""}` }, { children: children })), !!(buttons === null || buttons === void 0 ? void 0 : buttons.length) && (_jsxs(React.Fragment, { children: [_jsx(Divider, {}), _jsx("div", Object.assign({ className: "flex fullwidth" }, { children: buttons === null || buttons === void 0 ? void 0 : buttons.map((button, index) => (_jsx(Link, Object.assign({ className: "notextdecoration fullwidth", to: button.link }, { children: _jsx(Button, Object.assign({ className: "notexttransform font-size-18-force", color: "secondary", variant: "text", fullWidth: true }, { children: button.text })) }), index))) }))] }))] }))] })));
}
//# sourceMappingURL=popup.js.map