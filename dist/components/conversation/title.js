import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./css/title.css";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useBack, useIsSmallScreen } from "../ContextProvider";
/**
 * It's a component that renders the title of the thread.
 * @param {number} props.category The category of the thread
 * @param {string} props.title The title of of the thread
 * @param {string} props.slink The shortened link of the thread
 */
export default function Title(props) {
    const { category, title, btns } = props;
    const [history] = useBack();
    const isSmallScreen = useIsSmallScreen();
    return (_jsx(Box, Object.assign({ className: "title-root", sx: {
            bgcolor: "primary.main",
        } }, { children: _jsxs("div", Object.assign({ className: "flex ml10 mr20 align-center justify-space-between fullheight" }, { children: [_jsxs("div", Object.assign({ className: "flex align-center mr10 overflow-hidden" }, { children: [(history || category) && (_jsx(Link, Object.assign({ to: history || `/category/${category}` }, { children: _jsx(IconButton, Object.assign({ className: "nomargin nopadding" }, { children: _jsx(ArrowBackIcon, { color: "secondary" }) })) }))), _jsx(Typography, Object.assign({ className: `novmargin ml10 overflow-hidden text-overflow-ellipsis nowrap font-size-18-force title-text${isSmallScreen ? " text-align-center" : ""}`, sx: {
                                color: "secondary.main",
                            } }, { children: title }))] })), _jsx("div", Object.assign({ className: "flex" }, { children: !isSmallScreen &&
                        btns.map((btn, index) => (_jsx(Tooltip, Object.assign({ arrow: true, title: btn.title }, { children: _jsx(IconButton, Object.assign({ onClick: btn.action }, { children: btn.icon })) }), index))) }))] })) })));
}
//# sourceMappingURL=title.js.map