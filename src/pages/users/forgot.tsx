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

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Alert, Box, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
    useDarkMode,
    useNotification,
    useServerConfig,
    useUser,
    useWidth,
} from "../../components/AppContextProvider";
import MetahkgLogo from "../../components/logo";
import { severity } from "../../types/severity";
import { useMenu } from "../../components/MenuProvider";
import { Navigate } from "react-router-dom";
import queryString from "query-string";
import EmailValidator from "email-validator";
import { Send as SendIcon } from "@mui/icons-material";
import CAPTCHA, { CaptchaRefProps } from "../../lib/Captcha";
import { api } from "../../lib/api";
import { setTitle } from "../../lib/common";
import { parseError } from "../../lib/parseError";
import ReCaptchaNotice from "../../lib/reCaptchaNotice";

export default function Forgot() {
    const [menu, setMenu] = useMenu();
    const [, setNotification] = useNotification();
    const [width] = useWidth();
    const [alert, setAlert] = useState<{ severity: severity; text: string }>({
        severity: "info",
        text: "",
    });
    const [loading, setLoading] = useState(false);
    const query = queryString.parse(window.location.search);
    const [email, setEmail] = useState(String(query.email || ""));
    const [user] = useUser();
    const [serverConfig] = useServerConfig();
    const darkMode = useDarkMode();
    const captchaRef = useRef<CaptchaRefProps>(null);

    const small = width / 2 - 100 <= 450;

    useLayoutEffect(() => {
        setTitle("Forgot password | Metahkg");
        menu && setMenu(false);
    }, [menu, setMenu, user]);

    if (user) <Navigate to="/" replace />;

    async function onSubmit(e?: React.FormEvent<HTMLFormElement>) {
        e?.preventDefault();
        if (serverConfig?.captcha === "turnstile") {
            setLoading(true);
        }
        const captchaToken = await captchaRef.current?.executeAsync();
        if (!captchaToken) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setAlert({ severity: "info", text: "Requesting reset password..." });
        setNotification({
            open: true,
            severity: "info",
            text: "Requesting reset password...",
        });
        api.authForgot({ email, captchaToken })
            .then(() => {
                setNotification({
                    open: true,
                    text: `Reset password email sent.`,
                });
                setAlert({
                    severity: "success",
                    text: "Reset password email sent. Please click the link to reset your password.",
                });
                captchaRef.current?.reset();
                setLoading(false);
            })
            .catch((err) => {
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
                setLoading(false);
            });
    }

    useEffect(() => {
        if (query.email && !user) onSubmit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (user) return <Navigate to="/" replace />;

    return (
        <Box
            className="flex items-center justify-center min-h-screen w-full"
            sx={{ bgcolor: "primary.dark" }}
        >
            <Box sx={{ width: small ? "100vw" : "50vw" }}>
                <Box className="m-[40px]" component="form" onSubmit={onSubmit}>
                    <Box className="flex justify-center items-center !mb-[20px]">
                        <MetahkgLogo svg light={darkMode} height={50} width={40} />
                        <h1 className="text-[25px] my-0 !ml-[5px]">Forgot password</h1>
                    </Box>
                    {alert.text && (
                        <Alert className="!mb-[20px]" severity={alert.severity}>
                            {alert.text}
                        </Alert>
                    )}
                    <TextField
                        label="Email"
                        value={email}
                        type="email"
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                        variant="filled"
                        color="secondary"
                        required
                        fullWidth
                    />
                    <Box className="!mt-[20px]">
                        <CAPTCHA ref={captchaRef} />
                        <LoadingButton
                            variant="contained"
                            className="!text-[16px] !normal-case"
                            color="secondary"
                            type="submit"
                            disabled={
                                loading || !(email && EmailValidator.validate(email))
                            }
                            loading
                            startIcon={<SendIcon className="!text-[16px]" />}
                            loadingPosition="start"
                        >
                            Reset
                        </LoadingButton>
                        <ReCaptchaNotice />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
