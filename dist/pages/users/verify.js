import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Alert, Box, Button, TextField } from "@mui/material";
import { useNotification, useSettings, useUser, useWidth, } from "../../components/ContextProvider";
import MetahkgLogo from "../../components/logo";
import { useMenu } from "../../components/MenuProvider";
import { Link, Navigate, useNavigate } from "react-router-dom";
import queryString from "query-string";
import EmailValidator from "email-validator";
import { HowToReg } from "@mui/icons-material";
import { api, resetApi } from "../../lib/api";
import { decodeToken, setTitle } from "../../lib/common";
import { parseError } from "../../lib/parseError";
export default function Verify() {
    var _a;
    const [menu, setMenu] = useMenu();
    const [, setNotification] = useNotification();
    const [width] = useWidth();
    const [alert, setAlert] = useState({
        severity: "info",
        text: "",
    });
    const [disabled, setDisabled] = useState(false);
    const [settings] = useSettings();
    const query = queryString.parse(window.location.search);
    const [email, setEmail] = useState(decodeURIComponent(String(query.email || "")));
    const [code, setCode] = useState(decodeURIComponent(String(query.code || "")));
    const [user, setUser] = useUser();
    const navigate = useNavigate();
    function verify() {
        setAlert({ severity: "info", text: "Verifying..." });
        setNotification({ open: true, text: "Verifying..." });
        setDisabled(true);
        api.users
            .verify({
            email: email,
            code: code,
        })
            .then((res) => {
            localStorage.setItem("token", res.data.token);
            const user = decodeToken(res.data.token);
            setUser(user);
            resetApi();
            setNotification({
                open: true,
                text: `Logged in as ${user === null || user === void 0 ? void 0 : user.name}.`,
            });
            navigate(String(query.returnto || "/"));
        })
            .catch((err) => {
            setDisabled(false);
            setAlert({
                severity: "error",
                text: parseError(err),
            });
            setNotification({
                open: true,
                text: parseError(err),
            });
        });
    }
    useEffect(() => {
        if (query.code && query.email && !user)
            verify();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    if (user)
        return _jsx(Navigate, { to: "/", replace: true });
    menu && setMenu(false);
    setTitle("Verify | Metahkg");
    const small = width / 2 - 100 <= 450;
    return (_jsx(Box, Object.assign({ className: "flex align-center justify-center min-height-fullvh fullwidth", sx: { bgcolor: "primary.dark" } }, { children: _jsx(Box, Object.assign({ sx: { width: small ? "100vw" : "50vw" } }, { children: _jsxs("div", Object.assign({ className: "m40" }, { children: [_jsxs("div", Object.assign({ className: "flex justify-center align-center" }, { children: [_jsx(MetahkgLogo, { svg: true, light: true, height: 50, width: 40, className: "mb10" }), _jsx("h1", Object.assign({ className: "font-size-25 mb20 nohmargin" }, { children: "Verify" }))] })), alert.text && (_jsx(Alert, Object.assign({ className: "mb20", severity: alert.severity }, { children: alert.text }))), [
                        {
                            label: "Email",
                            value: email,
                            set: setEmail,
                            type: "email",
                        },
                        {
                            label: "Code",
                            value: code,
                            set: setCode,
                            type: "password",
                        },
                    ].map((item, index) => (_jsx(TextField, { label: item.label, value: item.value, type: item.type, className: !index ? "mb15" : "", onChange: (e) => {
                            item.set(e.target.value);
                        }, variant: "filled", color: "secondary", required: true, fullWidth: true }))), _jsx("h4", { children: _jsx(Link, Object.assign({ style: { color: ((_a = settings.secondaryColor) === null || _a === void 0 ? void 0 : _a.main) || "#f5bd1f" }, className: "link", to: "/users/resend" }, { children: "Resend verification email?" })) }), _jsxs(Button, Object.assign({ variant: "contained", className: "font-size-16-force notexttransform", color: "secondary", onClick: verify, disabled: disabled || !(email && code && EmailValidator.validate(email)) }, { children: [_jsx(HowToReg, { className: "mr5" }), "Verify"] }))] })) })) })));
}
//# sourceMappingURL=verify.js.map