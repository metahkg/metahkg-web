import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./css/pageselect.css";
import { Box, IconButton, MenuItem, Select } from "@mui/material";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
export default function PageSelect(props) {
    const { pages, page, onSelect, onLastClicked, onNextClicked, last, next } = props;
    return (_jsxs("div", Object.assign({ className: "pageselect-root flex flex-dir-column" }, { children: [last && (_jsx(Box, Object.assign({ className: "pageselect-top flex align-center justify-center" }, { children: _jsx(IconButton, Object.assign({ onClick: onLastClicked }, { children: _jsx(ArrowDropUp, {}) })) }))), _jsx(Box, Object.assign({ className: "pageselect-box flex justify-center align-center", sx: { borderRadius: last || next ? "0" : "50%" } }, { children: _jsx(Select, Object.assign({ value: page, label: "Age", onChange: onSelect, color: "secondary", variant: "standard", className: "pageselect-select nopadding flex align-center justify-center", disableUnderline: true }, { children: [...Array(pages)].map((p, index) => (_jsx(MenuItem, Object.assign({ value: index + 1 }, { children: index + 1 }), index))) })) })), next && (_jsx(Box, Object.assign({ className: "pageselect-bottom flex align-center justify-center" }, { children: _jsx(IconButton, Object.assign({ onClick: onNextClicked }, { children: _jsx(ArrowDropDown, {}) })) })))] })));
}
//# sourceMappingURL=pageselect.js.map