import { jsx as _jsx } from "react/jsx-runtime";
import { Alert, Box } from "@mui/material";
import { useMenu } from "../../components/MenuProvider";
import queryString from "query-string";
import { useNavigate } from "react-router-dom";
import { useNotification, useUser } from "../../components/ContextProvider";
import { resetApi } from "../../lib/api";
/**
 * Renders an alert while logging out.
 * @returns an info alert
 */
export default function Logout() {
    const [menu, setMenu] = useMenu();
    const [, setNotification] = useNotification();
    const [, setUser] = useUser();
    const navigate = useNavigate();
    const query = queryString.parse(window.location.search);
    (function onRender() {
        menu && setMenu(false);
        // logout
        localStorage.removeItem("token");
        setUser(null);
        resetApi();
        // go back
        navigate(decodeURIComponent(String(query.returnto || "/")), {
            replace: true,
        });
        setNotification({ open: true, text: "Logged out." });
    })();
    return (_jsx(Box, Object.assign({ className: "min-height-fullvh justify-center width-fullvw", sx: {
            backgroundColor: "primary.dark",
        } }, { children: _jsx("div", Object.assign({ className: "flex fullwidth justify-center" }, { children: _jsx(Alert, Object.assign({ className: "mt30 halfwidth", severity: "info" }, { children: "Logging you out..." })) })) })));
}
//# sourceMappingURL=logout.js.map