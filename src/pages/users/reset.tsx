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
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    TextField,
} from "@mui/material";
import {
    useNotification,
    useReCaptchaSiteKey,
    useSession,
    useUser,
    useWidth,
} from "../../components/AppContextProvider";
import MetahkgLogo from "../../components/logo";
import { severity } from "../../types/severity";
import { useMenu } from "../../components/MenuProvider";
import { Navigate, useNavigate } from "react-router-dom";
import queryString from "query-string";
import EmailValidator from "email-validator";
import { LockOpen } from "@mui/icons-material";
import { api } from "../../lib/api";
import { decodeToken, setTitle } from "../../lib/common";
import { parseError } from "../../lib/parseError";
import ReCAPTCHA from "react-google-recaptcha";
import ReCaptchaNotice from "../../lib/reCaptchaNotice";
import hash from "hash.js";

export default function Reset() {
    const [menu, setMenu] = useMenu();
    const [, setNotification] = useNotification();
    const [width] = useWidth();
    const [alert, setAlert] = useState<{ severity: severity; text: string }>({
        severity: "info",
        text: "",
    });
    const [disabled, setDisabled] = useState(false);
    const query = queryString.parse(window.location.search);
    const [email, setEmail] = useState(decodeURIComponent(String(query.email || "")));
    const [code, setCode] = useState(decodeURIComponent(String(query.code || "")));
    const [password, setPassword] = useState("");
    const [user] = useUser();
    const [, setSession] = useSession();
    const [sameIp, setSameIp] = useState(false);
    const reCaptchaSiteKey = useReCaptchaSiteKey();
    const reCaptchaRef = useRef<ReCAPTCHA>(null);
    const navigate = useNavigate();

    const small = width / 2 - 100 <= 450;

    async function onSubmit(e?: React.FormEvent<HTMLFormElement>) {
        e?.preventDefault();
        const rtoken = await reCaptchaRef.current?.executeAsync();
        if (!rtoken) return;
        setAlert({ severity: "info", text: "Reseting..." });
        setNotification({ open: true, severity: "info", text: "Reseting..." });
        setDisabled(true);
        api.authReset({
            email,
            code,
            password: hash.sha256().update(password).digest("hex"),
            rtoken,
            sameIp,
        })
            .then((data) => {
                setSession(data);
                setNotification({
                    open: true,
                    severity: "info",
                    text: `Logged in as ${decodeToken(data.token)?.name}.`,
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
                    severity: "error",
                    text: parseError(err),
                });
                reCaptchaRef.current?.reset();
            });
    }

    useLayoutEffect(() => {
        setTitle("Reset password | Metahkg");
        menu && setMenu(false);
    }, [menu, setMenu, user]);

    if (user) return <Navigate to="/" replace />;

    return (
        <Box
            className="flex items-center justify-center min-h-screen w-full"
            sx={{ bgcolor: "primary.dark" }}
        >
            <Box className={small ? "w-100v" : "w-50v"}>
                <Box className="m-[40px]" component="form" onSubmit={onSubmit}>
                    <Box className="flex justify-center items-center">
                        <MetahkgLogo
                            svg
                            light
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
                    {[
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
                        {
                            label: "New password",
                            value: password,
                            set: setPassword,
                            type: "password",
                            pattern: "\\S{8,}",
                            helperText:
                                "Password must be at least 8 characters long, without spaces.",
                        },
                    ].map((item, index) => (
                        <TextField
                            label={item.label}
                            value={item.value}
                            type={item.type}
                            className={index ? "!mt-[15px]" : ""}
                            onChange={(e) => {
                                item.set(e.target.value);
                            }}
                            variant="filled"
                            color="secondary"
                            required
                            fullWidth
                            helperText={item.helperText}
                            inputProps={{
                                ...(item.pattern && { pattern: item.pattern }),
                            }}
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
                    <ReCAPTCHA
                        theme="dark"
                        sitekey={reCaptchaSiteKey}
                        size="invisible"
                        ref={reCaptchaRef}
                    />
                    <Button
                        variant="contained"
                        className="!text-[16px] !normal-case"
                        color="secondary"
                        type="submit"
                        disabled={
                            disabled || !(email && code && EmailValidator.validate(email))
                        }
                    >
                        <LockOpen className="!mr-[5px]" />
                        Reset
                    </Button>
                    <ReCaptchaNotice />
                </Box>
            </Box>
        </Box>
    );
}
