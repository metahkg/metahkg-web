import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./css/register.css";
import { useState } from "react";
import hash from "hash.js";
import { Alert, Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, } from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";
import { Navigate, useNavigate } from "react-router-dom";
import { useMenu } from "../../components/MenuProvider";
import { useNotification, useSettings, useUser, useWidth, } from "../../components/ContextProvider";
import { reCaptchaSiteKey, setTitle } from "../../lib/common";
import MetahkgLogo from "../../components/logo";
import { Close, HowToReg } from "@mui/icons-material";
import { Link } from "react-router-dom";
import queryString from "query-string";
import { api } from "../../lib/api";
import { parseError } from "../../lib/parseError";
/**
 * Sex selector
 * @param props.disabled disable the selector
 * @param props.sex the selected sex
 * @param props.setSex: function to update sex
 */
function SexSelect(props) {
    const { sex, setSex, disabled } = props;
    const onChange = function (e) {
        setSex(e.target.value ? "M" : "F");
    };
    return (_jsxs(FormControl, Object.assign({ className: "register-sex-form" }, { children: [_jsx(InputLabel, Object.assign({ color: "secondary" }, { children: "Gender" })), _jsxs(Select, Object.assign({ color: "secondary", disabled: disabled, value: sex, label: "Gender", onChange: onChange, required: true }, { children: [_jsx(MenuItem, Object.assign({ value: 1 }, { children: "Male" })), _jsx(MenuItem, Object.assign({ value: 0 }, { children: "Female" }))] }))] })));
}
/**
 * Register component for /users/register
 * initially 3 text fields and a Select list (Sex)
 * When verification is pending
 * (waiting for user to type verification code sent to their email address),
 * there would be another textfield alongside Sex for the verification code
 * a captcha must be completed before registering, if registering fails,
 * the captcha would reload
 * process: register --> verify --> account created -->
 * redirect to query.returnto if exists, otherwise homepage after verification
 * If user already logged in, he is redirected to /
 * @returns register page
 */
export default function Register() {
    var _a;
    setTitle("Register | Metahkg");
    const [width] = useWidth();
    const [, setNotification] = useNotification();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [sex, setSex] = useState(undefined);
    const [disabled, setDisabled] = useState(false);
    const [rtoken, setRtoken] = useState("");
    const [alert, setAlert] = useState({
        severity: "info",
        text: "",
    });
    const [menu, setMenu] = useMenu();
    const [settings] = useSettings();
    const [user] = useUser();
    const query = queryString.parse(window.location.search);
    const navigate = useNavigate();
    function onSubmit(e) {
        e.preventDefault();
        setAlert({ severity: "info", text: "Registering..." });
        setDisabled(true);
        sex &&
            api.users
                .register({
                email,
                username: name,
                password: hash.sha256().update(pwd).digest("hex"),
                sex,
                rtoken,
            })
                .then(() => {
                setAlert({
                    severity: "success",
                    text: "A link has been sent to your email address. Please click the link to verify.",
                });
                setNotification({
                    open: true,
                    text: "Please click the link sent to your email address.",
                });
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
                setRtoken("");
                setDisabled(false);
                grecaptcha.reset();
            });
    }
    if (user)
        return _jsx(Navigate, { to: "/", replace: true });
    menu && setMenu(false);
    const small = width / 2 - 100 <= 450;
    const inputs = [
        {
            label: "Username",
            onChange: (e) => {
                setName(e.target.value);
            },
            type: "text",
            inputProps: { pattern: "S{1, 15}" },
        },
        {
            label: "Email",
            onChange: (e) => setEmail(e.target.value),
            type: "email",
            inputProps: {
                pattern: "[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@([0-9a-zA-Z][-\\w]*[0-9a-zA-Z]\\.)+[a-zA-Z]{2,9}",
            },
        },
        {
            label: "Password",
            onChange: (e) => setPwd(e.target.value),
            type: "password",
            inputProps: { pattern: ".{8,}" },
        },
    ];
    return (_jsx(Box, Object.assign({ className: "register-root flex fullwidth fullheight justify-center align-center", sx: {
            backgroundColor: "primary.dark",
        } }, { children: _jsx(Box, Object.assign({ className: "register-main-box", sx: {
                width: small ? "100vw" : "50vw",
            } }, { children: _jsxs("form", Object.assign({ className: "m40", onSubmit: onSubmit }, { children: [query.returnto && (_jsx("div", Object.assign({ className: "flex align-center justify-flex-end" }, { children: _jsx(IconButton, Object.assign({ onClick: () => {
                                navigate(String(query.returnto));
                            } }, { children: _jsx(Close, {}) })) }))), _jsxs("div", Object.assign({ className: "flex justify-center align-center" }, { children: [_jsx(MetahkgLogo, { svg: true, light: true, height: 50, width: 40, className: "mb10" }), _jsx("h1", Object.assign({ className: "font-size-25 mb20 nohmargin" }, { children: "Register" }))] })), alert.text && (_jsx(Alert, Object.assign({ className: "mb15 mt10", severity: alert.severity }, { children: alert.text }))), inputs.map((props, index) => (_jsx(TextField, Object.assign({ className: "mb15" }, props, { color: "secondary", disabled: disabled, variant: "filled", required: true, fullWidth: true }), index))), _jsx(SexSelect, { disabled: disabled, sex: sex, setSex: setSex }), _jsx("br", {}), _jsx("h4", { children: _jsx(Link, Object.assign({ style: { color: ((_a = settings.secondaryColor) === null || _a === void 0 ? void 0 : _a.main) || "#f5bd1f" }, className: "link", to: "/users/verify" }, { children: "Verify / Resend verification email?" })) }), _jsxs("div", Object.assign({ className: `${small
                            ? ""
                            : "flex fullwidth justify-space-between align-center"} mt15` }, { children: [_jsx(ReCAPTCHA, { theme: "dark", sitekey: reCaptchaSiteKey, onChange: (token) => {
                                    setRtoken(token || "");
                                } }), _jsxs(Button, Object.assign({ disabled: disabled || !rtoken, type: "submit", className: "font-size-16-force text-transform-none register-btn", color: "secondary", variant: "contained" }, { children: [_jsx(HowToReg, { className: "mr5 font-size-17-force" }), "Register"] }))] }))] })) })) })));
}
//# sourceMappingURL=register.js.map