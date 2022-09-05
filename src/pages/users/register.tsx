import React, { useLayoutEffect, useState } from "react";
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
    Typography,
} from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";
import { Navigate, useNavigate } from "react-router-dom";
import { useMenu } from "../../components/MenuProvider";
import {
    useNotification,
    useReCaptchaSiteKey,
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
import { parseError } from "../../lib/parseError";
import { UserSex } from "@metahkg/api";
import { css } from "../../lib/css";

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
        <FormControl className="!min-w-[200px]">
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

export default function Register() {
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
    const [user] = useUser();
    const reCaptchaSiteKey = useReCaptchaSiteKey();

    const query = queryString.parse(window.location.search);
    const navigate = useNavigate();

    const small = width / 2 - 100 <= 450;

    useLayoutEffect(() => {
        setTitle("Register | Metahkg");
        menu && setMenu(false);
    }, [menu, setMenu, user]);

    if (user) <Navigate to="/" replace />;

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setAlert({ severity: "info", text: "Registering..." });
        setDisabled(true);
        sex &&
            api
                .usersRegister({
                    email,
                    name,
                    pwd: hash.sha256().update(pwd).digest("hex"),
                    sex: sex as UserSex,
                    rtoken,
                })
                .then(() => {
                    setAlert({
                        severity: "success",
                        text: "A link has been sent to your email address. Please click the link to verify.",
                    });
                    setNotification({
                        open: true,
                        severity: "info",
                        text: "Please click the link sent to your email address.",
                    });
                })
                .catch((err) => {
                    setAlert({ severity: "error", text: parseError(err) });
                    setNotification({
                        open: true,
                        severity: "error",
                        text: parseError(err),
                    });
                    setRtoken("");
                    setDisabled(false);
                    grecaptcha.reset();
                });
    }

    const inputs: TextFieldProps[] = [
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
                pattern:
                    "[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@([0-9a-zA-Z][-\\w]*[0-9a-zA-Z]\\.)+[a-zA-Z]{2,9}",
            },
        },
        {
            label: "Password",
            onChange: (e) => setPwd(e.target.value),
            type: "password",
            inputProps: { pattern: ".{8,}" },
        },
    ];

    return (
        <Box
            className="min-h-screen flex w-full h-full justify-center items-center"
            sx={{
                backgroundColor: "primary.dark",
            }}
        >
            <Box className={`min-h-50v ${small ? "w-100v" : "w-50v"}`}>
                <Box component="form" onSubmit={onSubmit} className="m-[40px]">
                    {query.returnto && (
                        <Box className="flex items-center justify-end">
                            <IconButton
                                onClick={() => {
                                    navigate(String(query.returnto));
                                }}
                            >
                                <Close />
                            </IconButton>
                        </Box>
                    )}
                    <Box className="flex justify-center items-center">
                        <MetahkgLogo
                            svg
                            light
                            height={50}
                            width={40}
                            className="!mb-[10px]"
                        />
                        <h1 className="text-[25px] !mb-[20px] mx-0">Register</h1>
                    </Box>
                    {alert.text && (
                        <Alert
                            className="!mb-[15px] !mt-[10px]"
                            severity={alert.severity}
                        >
                            {alert.text}
                        </Alert>
                    )}
                    {inputs.map((props, index) => (
                        <TextField
                            className="!mb-[15px]"
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
                    <Box className="!mt-[15px] !mb-[15px]">
                        <Typography
                            component={Link}
                            to="/users/verify"
                            className={`${css.link} !font-bold`}
                            sx={(theme) => ({
                                color: `${theme.palette.secondary.main} !important`,
                            })}
                        >
                            Verify / Resend verification email
                        </Typography>
                    </Box>
                    <Box
                        className={`${
                            small ? "" : "flex w-full justify-between items-center"
                        } !mt-[15px]`}
                    >
                        <ReCAPTCHA
                            theme="dark"
                            sitekey={reCaptchaSiteKey}
                            onChange={(token) => {
                                setRtoken(token || "");
                            }}
                        />
                        <Button
                            disabled={disabled || !rtoken}
                            type="submit"
                            className="!text-[16px] !normal-case h-[40px]"
                            color="secondary"
                            variant="contained"
                        >
                            <HowToReg className="!mr-[5px] !text-[17px]" />
                            Register
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
