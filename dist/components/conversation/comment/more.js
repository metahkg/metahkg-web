import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/*
The MIT License (MIT)

Copyright (c) 2014 Call-Em-All

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
import React, { useEffect, useRef } from "react";
import { ClickAwayListener, Grow, IconButton, ListItemIcon, ListItemText, MenuItem, MenuList, Paper, Popper, Stack, Tooltip, } from "@mui/material";
import { MoreHoriz } from "@mui/icons-material";
export default function MoreList(props) {
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };
    const handleClose = (event) => {
        if (anchorRef.current &&
            anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };
    function handleListKeyDown(event) {
        if (event.key === "Tab") {
            event.preventDefault();
            setOpen(false);
        }
        else if (event.key === "Escape") {
            setOpen(false);
        }
    }
    // return focus to the button when we transitioned from !open -> open
    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);
    return (_jsx(Stack, Object.assign({ direction: "row", spacing: 1 }, { children: _jsxs("div", { children: [_jsx(Tooltip, Object.assign({ arrow: true, title: "More" }, { children: _jsx(IconButton, Object.assign({ ref: anchorRef, className: "nopadding ml10", "aria-controls": open ? "composition-menu" : undefined, "aria-expanded": open ? "true" : undefined, "aria-haspopup": "true", onClick: handleToggle }, { children: _jsx(MoreHoriz, { className: "metahkg-grey-force font-size-19-force mb2" }) })) })), _jsx(Popper, Object.assign({ open: open, style: { zIndex: 1000 }, anchorEl: anchorRef.current, role: undefined, placement: "bottom-start", transition: true, disablePortal: true }, { children: ({ TransitionProps, placement }) => (_jsx(Grow, Object.assign({}, TransitionProps, { style: {
                            transformOrigin: placement === "bottom-start"
                                ? "left top"
                                : "left bottom",
                        } }, { children: _jsx(Paper, { children: _jsx(ClickAwayListener, Object.assign({ onClickAway: handleClose }, { children: _jsx(MenuList, Object.assign({ autoFocusItem: open, id: "composition-menu", "aria-labelledby": "composition-button", onKeyDown: handleListKeyDown }, { children: props.buttons.map((button) => button && (_jsxs(MenuItem, Object.assign({ onClick: (e) => {
                                            button.action();
                                            handleClose(e);
                                        } }, { children: [_jsx(ListItemIcon, { children: button.icon }), _jsx(ListItemText, { children: button.title })] })))) })) })) }) }))) }))] }) })));
}
//# sourceMappingURL=more.js.map