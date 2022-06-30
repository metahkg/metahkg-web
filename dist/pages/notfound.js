import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./css/notfound.css";
import { Box } from "@mui/material";
import MetahkgLogo from "../components/logo";
import { useMenu } from "../components/MenuProvider";
import { setTitle } from "../lib/common";
/**
 * 404 page
 */
export default function NotFound() {
    const [menu, setMenu] = useMenu();
    setTitle("404 Not Found | Metahkg");
    menu && setMenu(false);
    return (_jsxs(Box, Object.assign({ className: "flex align-center justify-center notfound-root", sx: { bgcolor: "primary.dark" } }, { children: [_jsx(MetahkgLogo, { className: "mr10 mb20", svg: true, light: true, height: 100, width: 80 }), _jsx("h1", { children: "404 Not Found" })] })));
}
//# sourceMappingURL=notfound.js.map