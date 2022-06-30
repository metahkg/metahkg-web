import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./css/pagetop.css";
import { Box, MenuItem, Select, Typography } from "@mui/material";
export default function PageTop(props) {
    const { pages, page, onChange, last, next, onLastClicked, onNextClicked, id } = props;
    return (_jsxs(Box, Object.assign({ className: "flex justify-space-between align-center ml30 mr30 pagetop-root", id: String(id) }, { children: [_jsx(Typography, Object.assign({ className: last ? "pointer" : "user-select-none transparent", sx: last ? { color: "secondary.main" } : {}, onClick: last ? onLastClicked : () => { } }, { children: "Last Page" })), _jsx(Select, Object.assign({ value: page, label: "Age", onChange: onChange, color: "secondary", variant: "standard" }, { children: [...Array(pages)].map((p, index) => (_jsxs(MenuItem, Object.assign({ value: index + 1 }, { children: ["Page ", index + 1] }), index))) })), _jsx(Typography, Object.assign({ className: next ? "pointer" : "user-select-none transparent", sx: next ? { color: "secondary.main" } : {}, onClick: next ? onNextClicked : () => { } }, { children: "Next Page" }))] })));
}
//# sourceMappingURL=pagetop.js.map