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
import {
    Alert,
    Box,
    Checkbox,
    FormControlLabel,
    FormGroup,
    TextField,
    Typography,
} from "@mui/material";
import {
    useDarkMode,
    useNotification,
    useServerConfig,
    useSession,
    useUser,
    useWidth,
} from "../../components/AppContextProvider";
import MetahkgLogo from "../../components/logo";
import { severity } from "../../types/severity";
import { useMenu } from "../../components/MenuProvider";
import { Link, Navigate, useNavigate } from "react-router-dom";
import queryString from "query-string";
import EmailValidator from "email-validator";
import { HowToReg } from "@mui/icons-material";
import { api } from "../../lib/api";
import { setTitle } from "../../lib/common";
import { parseError } from "../../lib/parseError";
import { css } from "../../lib/css";
import CAPTCHA from "../../lib/captcha";
import ReCaptchaNotice from "../../lib/reCaptchaNotice";
import { loadUser } from "../../lib/jwt";
import { LoadingButton } from "@mui/lab";
import ReCAPTCHA from "@metahkg/react-captcha";

export default function Verify() {
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
    const [user] = useUser();
    const [, setSession] = useSession();
    const [sameIp, setSameIp] = useState(false);
    const [serverConfig] = useServerConfig();
    const darkMode = useDarkMode();
    const captchaRef = useRef<ReCAPTCHA>(null);
    const navigate = useNavigate();

    const small = width / 2 - 100 <= 450;

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
        setAlert({ severity: "info", text: "Verifying..." });
        setNotification({ open: true, severity: "info", text: "Verifying..." });
        api.authVerify({ email, code, captchaToken, sameIp })
            .then((data) => {
                setSession(data);
                setNotification({
                    open: true,
                    severity: "info",
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
        setTitle("Verify | Metahkg");
        menu && setMenu(false);
    }, [menu, setMenu, user]);

    useEffect(() => {
        if (query.code && query.email && !user) onSubmit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                            light={darkMode}
                            height={50}
                            width={40}
                            className="!mb-[10px]"
                        />
                        <h1 className="text-[25px] !mb-[20px] mx-0">Verify</h1>
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
                    ].map((item, index) => (
                        <TextField
                            label={item.label}
                            value={item.value}
                            type={item.type}
                            className={!index ? "!mb-[15px]" : ""}
                            onChange={(e) => {
                                item.set(e.target.value);
                            }}
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
                    <Box className="my-[15px]">
                        <Typography
                            component={Link}
                            sx={(theme) => ({
                                color: `${theme.palette.secondary.main} !important`,
                            })}
                            className={`${css.link} !font-bold`}
                            to="/users/resend"
                        >
                            Resend verification email
                        </Typography>
                    </Box>
                    <CAPTCHA ref={captchaRef} />
                    <LoadingButton
                        variant="contained"
                        className="!text-[16px] !normal-case"
                        color="secondary"
                        type="submit"
                        disabled={
                            loading || !(email && code && EmailValidator.validate(email))
                        }
                        loading={loading}
                        loadingPosition="start"
                        startIcon={<HowToReg />}
                    >
                        Verify
                    </LoadingButton>
                    <ReCaptchaNotice />
                </Box>
            </Box>
        </Box>
    );
}
