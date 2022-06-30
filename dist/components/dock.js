import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./css/dock.css";
import { Box, IconButton } from "@mui/material";
import SideBar from "./sidebar";
import { useIsSmallScreen } from "./ContextProvider";
/**
 * mobile dock
 */
export default function Dock(props) {
    const { btns } = props;
    const isSmallScreen = useIsSmallScreen();
    return (_jsx("div", { children: isSmallScreen && (_jsx(Box, Object.assign({ className: "flex fullwidth dock-root", sx: { bgcolor: "primary.dark", height: 50 } }, { children: _jsxs("div", Object.assign({ className: "flex justify-space-between fullwidth ml20 mr20 align-center" }, { children: [_jsx(SideBar, {}), btns.map((btn) => (_jsx(IconButton, Object.assign({ onClick: btn.action }, { children: btn.icon }))))] })) }))) }));
}
//# sourceMappingURL=dock.js.map