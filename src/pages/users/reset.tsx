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
import {
    Alert,
    Box,
    Checkbox,
    FormControlLabel,
    FormGroup,
    TextField,
    TextFieldProps,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
    useDarkMode,
    useNotification,
    useServerConfig,
    useSession,
    useWidth,
} from "../../components/AppContextProvider";
import MetahkgLogo from "../../components/logo";
import { severity } from "../../types/severity";
import { useMenu } from "../../components/MenuProvider";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import { LockOpen } from "@mui/icons-material";
import { api } from "../../lib/api";
import { setTitle } from "../../lib/common";
import { parseError } from "../../lib/parseError";
import CAPTCHA, { CaptchaRefProps } from "../../lib/Captcha";
import CaptchaNotice from "../../lib/captchaNotice";
import hash from "hash.js";
import { loadUser } from "../../lib/jwt";
import { regexString } from "../../lib/regex";

export default function Reset() {
    const [menu, setMenu] = useMenu();
    const [, setNotification] = useNotification();
    const [width] = useWidth();
    const [alert, setAlert] = useState<{ severity: severity; text: string }>({
        severity: "info",
        text: "",
    });
    const [loading, setLoading] = useState(false);
    const query = queryString.parse(window.location.search);
    const [email, setEmail] = useState(decodeURIComponent(String(query.email || "")));
    const [code, setCode] = useState(decodeURIComponent(String(query.code || "")));
    const [password, setPassword] = useState("");
    const [, setSession] = useSession();
    const [sameIp, setSameIp] = useState(false);
    const [serverConfig] = useServerConfig();
    const darkMode = useDarkMode();
    const captchaRef = useRef<CaptchaRefProps>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const navigate = useNavigate();

    const small = width / 2 - 100 <= 450;

    async function onSubmit(e?: React.FormEvent<HTMLFormElement>) {
        e?.preventDefault();
        if (serverConfig?.captcha.type === "turnstile") {
            setLoading(true);
        }
        const captchaToken = await captchaRef.current?.executeAsync();
        if (!captchaToken) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setAlert({ severity: "info", text: "Reseting..." });
        setNotification({ open: true, severity: "info", text: "Reseting..." });
        api.authReset({
            email,
            code,
            password: hash.sha256().update(password).digest("hex"),
            captchaToken,
            sameIp,
        })
            .then((data) => {
                setSession(data);
                setNotification({
                    open: true,
                    severity: "success",
                    text: `Logged in as ${loadUser(data.token)?.name}.`,
                });
                navigate(String(query.returnto || "/"));
            })
            .catch((err) => {
                setLoading(false);
                setAlert({
                    severity: "error",
                    text: parseError(err),
                });
                setNotification({
                    open: true,
                    severity: "error",
                    text: parseError(err),
                });
                captchaRef.current?.reset();
            });
    }

    useLayoutEffect(() => {
        setTitle(`Reset password | ${serverConfig?.branding || "Metahkg"}`);
        menu && setMenu(false);
    }, [menu, setMenu, serverConfig?.branding]);

    return (
        <Box
            className="flex items-center justify-center min-h-screen w-full"
            sx={{ bgcolor: "primary.dark" }}
        >
            <Box className={small ? "w-100v" : "w-50v"}>
                <Box
                    className="m-[40px]"
                    component="form"
                    ref={formRef}
                    onSubmit={onSubmit}
                >
                    <Box className="flex justify-center items-center">
                        <MetahkgLogo
                            svg
                            light={darkMode}
                            height={50}
                            width={40}
                            className="!mb-[10px]"
                        />
                        <h1 className="text-[25px] !mb-[20px] mx-0">Reset password</h1>
                    </Box>
                    {alert.text && (
                        <Alert className="!mb-[20px]" severity={alert.severity}>
                            {alert.text}
                        </Alert>
                    )}
                    {(
                        [
                            {
                                label: "Email",
                                value: email,
                                onChange: (e) => setEmail(e.target.value),
                                type: "email",
                            },
                            {
                                label: "Code",
                                value: code,
                                onChange: (e) => setCode(e.target.value),
                                type: "password",
                            },
                            {
                                label: "New password",
                                value: password,
                                onChange: (e) => setPassword(e.target.value),
                                type: "password",
                                inputProps: {
                                    pattern: regexString.password,
                                },
                                helperText:
                                    "Password must be at least 8 characters long, without spaces.",
                            },
                        ] as TextFieldProps[]
                    ).map((props, index) => (
                        <TextField
                            {...props}
                            className={index ? "!mt-[15px]" : ""}
                            variant="filled"
                            color="secondary"
                            required
                            fullWidth
                        />
                    ))}
                    <FormGroup className="my-[15px]">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color="secondary"
                                    onChange={(e) => {
                                        setSameIp(e.target.checked);
                                    }}
                                    checked={sameIp}
                                />
                            }
                            label="Restrict session to same ip address"
                        />
                    </FormGroup>
                    <CAPTCHA ref={captchaRef} />
                    <LoadingButton
                        variant="contained"
                        className="!text-[16px] !normal-case"
                        color="secondary"
                        type="submit"
                        disabled={loading || !formRef.current?.checkValidity()}
                        loading={loading}
                        startIcon={<LockOpen />}
                        loadingPosition="start"
                    >
                        Reset
                    </LoadingButton>
                    <CaptchaNotice />
                </Box>
            </Box>
        </Box>
    );
}
