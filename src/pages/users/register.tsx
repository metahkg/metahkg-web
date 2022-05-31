import "./css/register.css";
import React, { useState } from "react";
import hash from "hash.js";
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
    TextFieldProps,
} from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";
import { Navigate, useNavigate } from "react-router-dom";
import { useMenu } from "../../components/MenuProvider";
import {
    useNotification,
    useSettings,
    useUser,
    useWidth,
} from "../../components/ContextProvider";
import { setTitle } from "../../lib/common";
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
    const onChange = function (e: SelectChangeEvent) {
        setSex(e.target.value ? "M" : "F");
    };
    return (
        <FormControl className="register-sex-form">
            <InputLabel color="secondary">Gender</InputLabel>
            <Select
                color="secondary"
                disabled={disabled}
                value={sex}
                label="Gender"
                onChange={onChange}
                required
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
 * If user already logged in, he is redirected to /
 * @returns register page
 */
export default function Register() {
    setTitle("Register | Metahkg");
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
    const [user] = useUser();

    const query = queryString.parse(window.location.search);
    const navigate = useNavigate();

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setAlert({ severity: "info", text: "Registering..." });
        setDisabled(true);
        api.post("/users/register", {
            email,
            name,
            pwd: hash.sha256().update(pwd).digest("hex"),
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

    if (user) return <Navigate to="/" replace />;

    menu && setMenu(false);
    const small = width / 2 - 100 <= 450;

    const inputs: TextFieldProps[] = [
        {
            label: "Username",
            onChange: (e) => {
                setName(e.target.value);
            },
            type: "text",
            inputProps: { pattern: "S{1, 15}" },
            helperText: !name.match(/^\S{1,15}$/)
                ? "Username must be one word and less than 16 characters."
                : "",
        },
        {
            label: "Email",
            onChange: (e) => setEmail(e.target.value),
            type: "email",
            inputProps: {
                pattern:
                    "[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@([0-9a-zA-Z][-\\w]*[0-9a-zA-Z]\\.)+[a-zA-Z]{2,9}",
            },
            helperText: !email.match(
                /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9}$/
            )
                ? "Please enter a valid email address."
                : "",
        },
        {
            label: "Password",
            onChange: (e) => setPwd(e.target.value),
            type: "password",
            inputProps: { pattern: ".{8,}" },
            helperText: pwd.length < 8 ? "Password must have at least 8 characters." : "",
        },
    ];

    return (
        <Box
            className="register-root flex fullwidth fullheight justify-center align-center"
            sx={{
                backgroundColor: "primary.dark",
            }}
        >
            <Box
                className="register-main-box"
                sx={{
                    width: small ? "100vw" : "50vw",
                }}
            >
                <form className="m40" onSubmit={onSubmit}>
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
                    {inputs.map((props, index) => (
                        <TextField
                            className="mb15"
                            key={index}
                            {...props}
                            color="secondary"
                            disabled={disabled}
                            variant="filled"
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
                            small
                                ? ""
                                : "flex fullwidth justify-space-between align-center"
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
                            disabled={disabled || !rtoken}
                            type="submit"
                            className="font-size-16-force text-transform-none register-btn"
                            color="secondary"
                            variant="contained"
                        >
                            <HowToReg className="mr5 font-size-17-force" />
                            Register
                        </Button>
                    </div>
                </form>
            </Box>
        </Box>
    );
}
