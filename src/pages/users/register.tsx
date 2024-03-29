/*
 Copyright (C) 2022-present Metahkg Contributors

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React, { useLayoutEffect, useRef, useState } from "react";
import hash from "hash.js";
import {
    Alert,
    Box,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    TextFieldProps,
    Typography,
} from "@mui/material";
import CAPTCHA, { CaptchaRefProps } from "../../lib/Captcha";
import { Navigate, useNavigate } from "react-router-dom";
import { useMenu } from "../../components/MenuProvider";
import {
    useDarkMode,
    useNotification,
    useServerConfig,
    useUser,
    useWidth,
} from "../../components/AppContextProvider";
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
import CaptchaNotice from "../../lib/captchaNotice";
import { LoadingButton } from "@mui/lab";
import { regexString } from "../../lib/regex";

export default function Register() {
    const [width] = useWidth();
    const [, setNotification] = useNotification();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [inviteCode, setInviteCode] = useState("");
    const [sex, setSex] = useState<"M" | "F" | undefined>(undefined);
    const [disable, setDisable] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isValid, setIsValid] = useState(false);
    const [alert, setAlert] = useState<{ severity: severity; text: string }>({
        severity: "info",
        text: "",
    });
    const [menu, setMenu] = useMenu();
    const [user] = useUser();
    const [serverConfig] = useServerConfig();
    const formRef = useRef<HTMLFormElement>(null);
    const darkMode = useDarkMode();
    const captchaRef = useRef<CaptchaRefProps>(null);

    const query = queryString.parse(window.location.search);
    const navigate = useNavigate();

    const small = width / 2 - 100 <= 450;

    useLayoutEffect(() => {
        setTitle(`Register | ${serverConfig?.branding || "Metahkg"}`);
        menu && setMenu(false);
    }, [menu, setMenu, user, serverConfig?.branding]);

    if (user) <Navigate to="/" replace />;

    async function onSubmit(e?: React.FormEvent<HTMLFormElement>) {
        e?.preventDefault();
        if (serverConfig?.captcha.type === "turnstile") {
            setLoading(true);
            setDisable(true);
        }
        const captchaToken = await captchaRef.current?.executeAsync();
        if (!captchaToken) {
            setLoading(false);
            setDisable(false);
            return;
        }
        setDisable(true);
        setLoading(true);
        setAlert({ severity: "info", text: "Registering..." });
        api.authRegister({
            email,
            name,
            password: hash.sha256().update(password).digest("hex"),
            sex: sex as UserSex,
            captchaToken,
            ...(inviteCode && { inviteCode }),
        })
            .then(() => {
                setAlert({
                    severity: "success",
                    text: "A link has been sent to your email address. Please click the link to verify.",
                });
                setNotification({
                    open: true,
                    severity: "success",
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
                setDisable(false);
                captchaRef.current?.reset();
            });
        setLoading(false);
    }

    const inputs: TextFieldProps[] = [
        {
            label: "Username",
            onChange: (e) => {
                setName(e.target.value);
            },
            type: "text",
            inputProps: {
                pattern: regexString.username,
            },
            helperText: "1-15 en/jp/greek/zh-tw/number/emoji characters without spaces",
        },
        {
            label: "Email",
            onChange: (e) => setEmail(e.target.value),
            type: "email",
            inputProps: {
                pattern: regexString.email,
            },
        },
        {
            label: "Password",
            onChange: (e) => setPassword(e.target.value),
            type: "password",
            inputProps: { pattern: regexString.password },
            helperText: "At least 8 characters long without spaces",
        },
    ];

    return (
        <Box
            className="min-h-screen flex w-full justify-center items-center"
            sx={{
                backgroundColor: "primary.dark",
            }}
        >
            <Box className={`min-h-50v ${small ? "w-100v" : "w-50v"}`}>
                <Box
                    component="form"
                    ref={formRef}
                    onSubmit={onSubmit}
                    onChange={(e) => {
                        setIsValid(e.currentTarget.checkValidity());
                    }}
                    className="m-[50px]"
                >
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
                            light={darkMode}
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
                            color="secondary"
                            disabled={disable}
                            variant="filled"
                            required
                            fullWidth
                            {...props}
                        />
                    ))}
                    <FormControl required className="!min-w-[200px]">
                        <InputLabel color="secondary">Gender</InputLabel>
                        <Select
                            color="secondary"
                            defaultValue=""
                            disabled={disable}
                            label="Gender"
                            onChange={(e) => {
                                setSex(e.target.value as "M" | "F" | undefined);
                                // wait until formRef is updated
                                setTimeout(() => {
                                    if (formRef.current) {
                                        setIsValid(formRef.current?.checkValidity());
                                    }
                                });
                            }}
                        >
                            <MenuItem value="M">Male</MenuItem>
                            <MenuItem value="F">Female</MenuItem>
                        </Select>
                    </FormControl>
                    {serverConfig?.register.mode === "invite" && (
                        <TextField
                            className="!mt-[15px] !min-w-[300px] !mr-[100%]"
                            color="secondary"
                            disabled={disable}
                            required
                            label="Invite Code"
                            onChange={(e) => {
                                setInviteCode(e.target.value);
                            }}
                            type="text"
                            variant="outlined"
                            inputProps={{
                                pattern: regexString.inviteCode,
                            }}
                        />
                    )}
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
                    <Box className="!mt-[15px]">
                        <CAPTCHA ref={captchaRef} />
                        <LoadingButton
                            disabled={disable || !isValid}
                            loading={loading}
                            loadingPosition="start"
                            startIcon={<HowToReg className="!text-[17px]" />}
                            type="submit"
                            className="!text-[16px] !normal-case h-[40px]"
                            color="secondary"
                            variant="contained"
                        >
                            Register
                        </LoadingButton>
                        <CaptchaNotice />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
