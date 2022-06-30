import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./css/preload.css";
import { Box, Button, Divider } from "@mui/material";
import { Shimmer } from "../../lib/shimmer/shimmer";
import { roundup } from "../../lib/common";
import { useSearch } from "../MenuProvider";
import { useHeight, useIsSmallScreen, useWidth } from "../ContextProvider";
/* A component that is used to preload the menu. */
export default function MenuPreload() {
    const [search] = useSearch();
    const isSmallScreen = useIsSmallScreen();
    const [height] = useHeight();
    const [width] = useWidth();
    const totalheight = height - (search ? 151 : 91);
    const amount = roundup(totalheight / 72);
    const buttonwidth = isSmallScreen ? width : 0.3 * width;
    return (_jsx(Box, Object.assign({ className: "preload-root", sx: { minHeight: totalheight } }, { children: [...Array(amount)].map((_, index) => (_jsxs("div", { children: [_jsxs(Button, Object.assign({ className: "fullwidth flex align-flex-start flex-dir-column justify-center preload-btn" }, { children: [_jsx(Shimmer, { className: "ml10", height: 18, width: buttonwidth * 0.45 }), _jsx("div", { className: "ml10 preload-spacer" }), _jsx(Shimmer, { className: "ml10", height: 22, width: buttonwidth * 0.8 })] })), _jsx(Divider, {})] }, index))) })));
}
//# sourceMappingURL=menuPreload.js.map