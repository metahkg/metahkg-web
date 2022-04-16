import "./css/signup.css";
import React, { useState } from "react";
import hash from "hash.js";
import * as EmailValidator from "email-validator";
import {
    Alert,
    Box,
    Button,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
} from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";
import { Navigate, useNavigate } from "react-router-dom";
import { useMenu } from "../../components/MenuProvider";
import { useNotification, useSettings, useWidth } from "../../components/ContextProvider";
import { checkpwd } from "../../lib/common";
import { severity } from "../../types/severity";
import MetahkgLogo from "../../components/logo";
import { Close, HowToReg } from "@mui/icons-material";
import { Link } from "react-router-dom";
import queryString from "query-string";
import { api } from "../../lib/api";

declare const grecaptcha: { reset: () => void };

/**
 * Sex selector
 * @param props.disabled disable the selector
 * @param props.sex the selected sex
 * @param props.setSex: function to update sex
 */
function SexSelect(props: {
    sex: "M" | "F" | undefined;
    setSex: React.Dispatch<React.SetStateAction<"M" | "F" | undefined>>;
    disabled: boolean;
}) {
    const { sex, setSex, disabled } = props;
    const onChange = function (e: SelectChangeEvent<string>) {
        setSex(e.target.value ? "M" : "F");
    };
    return (
        <FormControl className="signup-sex-form">
            <InputLabel color="secondary">Sex</InputLabel>
            <Select
                color="secondary"
                disabled={disabled}
                value={sex}
                label="Gender"
                onChange={onChange}
            >
                <MenuItem value={1}>Male</MenuItem>
                <MenuItem value={0}>Female</MenuItem>
            </Select>
        </FormControl>
    );
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
 * If user already signed in, he is redirected to /
 * @returns register page
 */
export default function Register() {
    document.title = "Register | Metahkg";
    const [width] = useWidth();
    const [, setNotification] = useNotification();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [sex, setSex] = useState<"M" | "F" | undefined>(undefined);
    const [disabled, setDisabled] = useState(false);
    const [rtoken, setRtoken] = useState("");
    const [alert, setAlert] = useState<{ severity: severity; text: string }>({
        severity: "info",
        text: "",
    });
    const [menu, setMenu] = useMenu();
    const [settings] = useSettings();
    const query = queryString.parse(window.location.search);
    const navigate = useNavigate();

    function register() {
        setAlert({ severity: "info", text: "Registering..." });
        setDisabled(true);
        const errors = [
            { cond: !EmailValidator.validate(email), alert: "Email invalid." },
            {
                cond: name.split(" ")[1] || name.length > 15,
                alert: "Username must be one word and less than 16 characters.",
            },
            {
                cond: EmailValidator.validate(name),
                alert: "Username must not be a email.",
            },
            {
                cond: !checkpwd(pwd),
                alert: "Password must contain 8 characters, an uppercase, a lowercase, and a number.",
            },
        ];
        for (const error of errors) {
            if (error.cond) {
                setAlert({ severity: "error", text: error.alert });
                setNotification({ open: true, text: error.alert });
                setDisabled(false);
                return;
            }
        }
        api.post("/users/register", {
            email: email,
            name: name,
            pwd: hash.sha256().update(pwd).digest("hex"),
            sex: sex,
            rtoken: rtoken,
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
                    text: err?.response?.data?.error || err?.response?.data || "",
                });
                setNotification({
                    open: true,
                    text: err?.response?.data?.error || err?.response?.data || "",
                });
                setRtoken("");
                setDisabled(false);
                grecaptcha.reset();
            });
    }

    if (localStorage.user) return <Navigate to="/" replace />;
    menu && setMenu(false);
    const small = width / 2 - 100 <= 450;
    return (
        <Box
            className="signup-root flex fullwidth fullheight justify-center align-center"
            sx={{
                backgroundColor: "primary.dark",
            }}
        >
            <Box
                className="signup-main-box"
                sx={{
                    width: small ? "100vw" : "50vw",
                }}
            >
                <div className="m40">
                    {query.returnto && (
                        <div className="flex align-center justify-flex-end">
                            <IconButton
                                onClick={() => {
                                    navigate(String(query.returnto));
                                }}
                            >
                                <Close />
                            </IconButton>
                        </div>
                    )}
                    <div className="flex justify-center align-center">
                        <MetahkgLogo svg light height={50} width={40} className="mb10" />
                        <h1 className="font-size-25 mb20 nohmargin">Register</h1>
                    </div>
                    {alert.text && (
                        <Alert className="mb15 mt10" severity={alert.severity}>
                            {alert.text}
                        </Alert>
                    )}
                    {[
                        { label: "Username", set: setName, type: "text" },
                        { label: "Email", set: setEmail, type: "email" },
                        { label: "Password", set: setPwd, type: "password" },
                    ].map((item) => (
                        <TextField
                            className="mb15"
                            sx={{ input: { color: "white" } }}
                            color="secondary"
                            disabled={disabled}
                            variant="filled"
                            type={item.type}
                            onChange={(e) => {
                                item.set(e.target.value);
                            }}
                            label={item.label}
                            required
                            fullWidth
                        />
                    ))}
                    <SexSelect disabled={disabled} sex={sex} setSex={setSex} />
                    <br />
                    <h4>
                        <Link
                            style={{ color: settings.secondaryColor?.main || "#f5bd1f" }}
                            className="link"
                            to="/users/verify"
                        >
                            Verify / Resend verification email?
                        </Link>
                    </h4>
                    <div
                        className={`${
                            small ? "" : "flex fullwidth justify-space-between"
                        } mt15`}
                    >
                        <ReCAPTCHA
                            theme="dark"
                            sitekey={
                                process.env.REACT_APP_recaptchasitekey ||
                                "6LcX4bceAAAAAIoJGHRxojepKDqqVLdH9_JxHQJ-"
                            }
                            onChange={(token) => {
                                setRtoken(token || "");
                            }}
                        />
                        <Button
                            disabled={
                                disabled || !(rtoken && name && email && pwd && sex)
                            }
                            type="submit"
                            className="mt20 font-size-16-force notexttransform signup-btn"
                            color="secondary"
                            variant="contained"
                            onClick={register}
                        >
                            <HowToReg className="mr5 font-size-17-force" />
                            Register
                        </Button>
                    </div>
                </div>
            </Box>
        </Box>
    );
}
