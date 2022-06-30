import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./css/login.css";
import { useEffect, useState } from "react";
import { Alert, Box, Button, TextField } from "@mui/material";
import hash from "hash.js";
import { Link } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";
import queryString from "query-string";
import { useMenu } from "../../components/MenuProvider";
import { useNotification, useSettings, useIsSmallScreen, useUser, } from "../../components/ContextProvider";
import MetahkgLogo from "../../components/logo";
import { Login as LoginIcon } from "@mui/icons-material";
import { api, resetApi } from "../../lib/api";
import { decodeToken, setTitle } from "../../lib/common";
import { parseError } from "../../lib/parseError";
export default function Login() {
    var _a;
    const navigate = useNavigate();
    const [menu, setMenu] = useMenu();
    const [, setNotification] = useNotification();
    const [settings] = useSettings();
    const isSmallScreen = useIsSmallScreen();
    const [name, setName] = useState("");
    const [pwd, setPwd] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [user, setUser] = useUser();
    const [alert, setAlert] = useState({
        severity: "info",
        text: "",
    });
    useEffect(() => {
        if (query === null || query === void 0 ? void 0 : query.continue) {
            setAlert({ severity: "info", text: "Login to continue." });
            setNotification({ open: true, text: "Login in to continue." });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    if (user)
        return _jsx(Navigate, { to: "/", replace: true });
    menu && setMenu(false);
    setTitle("Login | Metahkg");
    const query = queryString.parse(window.location.search);
    function login() {
        setAlert({ severity: "info", text: "Logging in..." });
        setDisabled(true);
        api.users
            .login({
            userNameOrEmail: name,
            password: hash.sha256().update(pwd).digest("hex"),
        })
            .then((res) => {
            localStorage.setItem("token", res.data.token);
            const user = decodeToken(res.data.token);
            setUser(user);
            resetApi();
            navigate(decodeURIComponent(String(query.returnto || "/")), {
                replace: true,
            });
            setNotification({ open: true, text: `Logged in as ${user === null || user === void 0 ? void 0 : user.name}.` });
        })
            .catch((err) => {
            setAlert({
                severity: "error",
                text: parseError(err),
            });
            setNotification({
                open: true,
                text: parseError(err),
            });
            setDisabled(false);
        });
    }
    return (_jsx(Box, Object.assign({ className: "flex align-center justify-center fullwidth min-height-fullvh", sx: {
            backgroundColor: "primary.dark",
        } }, { children: _jsx(Box, Object.assign({ className: "login-main-box", sx: {
                width: isSmallScreen ? "100vw" : "50vw",
            } }, { children: _jsxs("div", Object.assign({ className: "ml50 mr50" }, { children: [_jsx("div", Object.assign({ className: "flex fullwidth justify-flex-end" }, { children: _jsx(Link, Object.assign({ className: "notextdecoration", to: `/users/register${window.location.search}` }, { children: _jsx(Button, Object.assign({ className: "flex notexttransform font-size-18-force", color: "secondary", variant: "text" }, { children: _jsx("strong", { children: "Register" }) })) })) })), _jsxs("div", Object.assign({ className: "flex justify-center align-center" }, { children: [_jsx(MetahkgLogo, { height: 50, width: 40, svg: true, light: true, className: "mb10" }), _jsx("h1", Object.assign({ className: "font-size-25 mb20" }, { children: "Login" }))] })), alert.text && (_jsx(Alert, Object.assign({ className: "mb15 mt10", severity: alert.severity }, { children: alert.text }))), [
                        { label: "Username / Email", type: "text", set: setName },
                        { label: "Password", type: "password", set: setPwd },
                    ].map((item, index) => (_jsx(TextField, { className: !index ? "mb15" : "", color: "secondary", type: item.type, label: item.label, variant: "filled", onChange: (e) => {
                            item.set(e.target.value);
                        }, required: true, fullWidth: true }))), _jsx("h4", { children: _jsx(Link, Object.assign({ style: { color: ((_a = settings.secondaryColor) === null || _a === void 0 ? void 0 : _a.main) || "#f5bd1f" }, className: "link", to: "/users/verify" }, { children: "Verify / Resend verification email?" })) }), _jsxs(Button, Object.assign({ disabled: disabled || !(name && pwd), className: "font-size-16-force notexttransform login-btn", color: "secondary", variant: "contained", onClick: login }, { children: [_jsx(LoginIcon, { className: "mr5 font-size-16-force" }), "Login"] }))] })) })) })));
}
//# sourceMappingURL=login.js.map