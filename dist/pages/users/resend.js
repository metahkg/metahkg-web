import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Alert, Box, Button, TextField } from "@mui/material";
import { useNotification, useUser, useWidth } from "../../components/ContextProvider";
import MetahkgLogo from "../../components/logo";
import { useMenu } from "../../components/MenuProvider";
import { Navigate } from "react-router-dom";
import queryString from "query-string";
import EmailValidator from "email-validator";
import { Send as SendIcon } from "@mui/icons-material";
import ReCAPTCHA from "react-google-recaptcha";
import { api } from "../../lib/api";
import { reCaptchaSiteKey, setTitle } from "../../lib/common";
import { parseError } from "../../lib/parseError";
export default function Verify() {
    setTitle("Resend Verification Email | Metahkg");
    const [menu, setMenu] = useMenu();
    const [, setNotification] = useNotification();
    const [width] = useWidth();
    const [alert, setAlert] = useState({
        severity: "info",
        text: "",
    });
    const [disabled, setDisabled] = useState(false);
    const query = queryString.parse(window.location.search);
    const [email, setEmail] = useState(String(query.email || ""));
    const [rtoken, setRtoken] = useState("");
    const [user] = useUser();
    function resend() {
        setAlert({ severity: "info", text: "Requesting resend..." });
        setNotification({ open: true, text: "Requesting resend..." });
        setDisabled(true);
        api.users
            .resend({
            email: email,
            rtoken: rtoken,
        })
            .then(() => {
            setNotification({
                open: true,
                text: `Verification email sent.`,
            });
            setAlert({
                severity: "success",
                text: "Verification email sent.",
            });
            grecaptcha.reset();
            setRtoken("");
            setDisabled(false);
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
            grecaptcha.reset();
            setRtoken("");
            setDisabled(false);
        });
    }
    useEffect(() => {
        if (query.email && !user)
            resend();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    if (user)
        return _jsx(Navigate, { to: "/", replace: true });
    menu && setMenu(false);
    const small = width / 2 - 100 <= 450;
    return (_jsx(Box, Object.assign({ className: "flex align-center justify-center min-height-fullvh fullwidth", sx: { bgcolor: "primary.dark" } }, { children: _jsx(Box, Object.assign({ sx: { width: small ? "100vw" : "50vw" } }, { children: _jsxs("div", Object.assign({ className: "m40" }, { children: [_jsxs("div", Object.assign({ className: "flex justify-center align-center" }, { children: [_jsx(MetahkgLogo, { svg: true, light: true, height: 50, width: 40, className: "mb10" }), _jsx("h1", Object.assign({ className: "font-size-25 mb20 nohmargin" }, { children: "Resend Verification Email" }))] })), alert.text && (_jsx(Alert, Object.assign({ className: "mb20", severity: alert.severity }, { children: alert.text }))), _jsx(TextField, { label: "Email", value: email, type: "email", onChange: (e) => {
                            setEmail(e.target.value);
                        }, variant: "filled", color: "secondary", required: true, fullWidth: true }), _jsxs("div", Object.assign({ className: `${small
                            ? ""
                            : "flex fullwidth align-center justify-space-between"} mt20` }, { children: [_jsx(ReCAPTCHA, { theme: "dark", sitekey: reCaptchaSiteKey, onChange: (token) => {
                                    setRtoken(token || "");
                                } }), _jsxs(Button, Object.assign({ variant: "contained", className: `font-size-16-force notexttransform${small ? " mt20" : ""}`, color: "secondary", onClick: resend, disabled: disabled ||
                                    !(email && rtoken && EmailValidator.validate(email)) }, { children: [_jsx(SendIcon, { className: "mr5 font-size-16-force" }), "Resend"] }))] }))] })) })) })));
}
//# sourceMappingURL=resend.js.map