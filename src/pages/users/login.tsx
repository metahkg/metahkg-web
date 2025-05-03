/*
 Copyright (C) 2022-present Wong Chun Yat (wcyat)

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

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Alert,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    TextField,
    Typography,
} from "@mui/material";
import hash from "hash.js";
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import { useMenu } from "../../components/MenuProvider";
import {
    useNotification,
    useIsSmallScreen,
    useUser,
    useSession,
    useDarkMode,
    useServerConfig,
} from "../../components/AppContextProvider";
import { severity } from "../../types/severity";
import MetahkgLogo from "../../components/logo";
import { Login as LoginIcon } from "@mui/icons-material";
import { api } from "../../lib/api";
import { setTitle } from "../../lib/common";
import { parseError } from "../../lib/parseError";
import { css } from "../../lib/css";
import CAPTCHA, { CaptchaRefProps } from "../../lib/Captcha";
import CaptchaNotice from "../../lib/captchaNotice";
import { loadUser } from "../../lib/jwt";
import { LoadingButton } from "@mui/lab";
import { memo } from "react";
const Login = memo(function Login() {
    const { t } = useTranslation();
    const [menu, setMenu] = useMenu();
    const [, setNotification] = useNotification();
    const isSmallScreen = useIsSmallScreen();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [user] = useUser();
    const [, setSession] = useSession();
    const [alert, setAlert] = useState<{ severity: severity; text: string }>({
        severity: "info",
        text: "",
    });
    const [sameIp, setSameIp] = useState(false);
    const [serverConfig] = useServerConfig();
    const darkMode = useDarkMode();
    const captchaRef = useRef<CaptchaRefProps>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const navigate = useNavigate();

    const query = queryString.parse(window.location.search);

    useEffect(() => {
        if (query?.continue) {
            setAlert({ severity: "info", text: t("login.continue") });
            setNotification({
                open: true,
                severity: "info",
                text: t("login.continue"),
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useLayoutEffect(() => {
        setTitle(`${t("login.title")} | ${serverConfig?.branding || "Metahkg"}`);
        menu && setMenu(false);
    }, [menu, setMenu, user, serverConfig?.branding, t]);

    const onSubmit = useCallback(
        async (e?: React.FormEvent<HTMLFormElement>) => {
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
            setAlert({ severity: "info", text: t("login.logging_in") });
            api.authLogin({
                name,
                password: hash.sha256().update(password).digest("hex"),
                sameIp,
                captchaToken,
            })
                .then((data) => {
                    setSession(data);
                    navigate(decodeURIComponent(String(query.returnto || "/")), {
                        replace: true,
                    });
                    setNotification({
                        open: true,
                        severity: "success",
                        text: t("login.logged_in_as", {
                            name: loadUser(data.token)?.name,
                        }),
                    });
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
                    setLoading(false);
                    captchaRef.current?.reset();
                });
        },
        [
            name,
            navigate,
            password,
            query.returnto,
            sameIp,
            serverConfig?.captcha.type,
            setNotification,
            setSession,
            t,
        ]
    );

    if (user) return <Navigate to="/" replace />;

    return (
        <Box
            className="flex items-center justify-center w-full min-h-screen"
            sx={{
                backgroundColor: "primary.dark",
            }}
        >
            <Box
                className={`min-h-50v ${isSmallScreen ? "w-100v" : "w-50v"}`}
                component="form"
                ref={formRef}
                onSubmit={onSubmit}
            >
                <Box className="m-[50px]">
                    <Box className="flex justify-center items-center">
                        <MetahkgLogo
                            height={50}
                            width={40}
                            svg
                            light={darkMode}
                            className="!mb-[10px]"
                        />
                        <h1 className="text-[25px] !mb-[20px]">{t("login.title")}</h1>
                    </Box>
                    {alert.text && (
                        <Alert
                            className="!mb-[15px] !mt-[10px]"
                            severity={alert.severity}
                        >
                            {alert.text}
                        </Alert>
                    )}
                    {[
                        {
                            label: t("login.username_email_label"),
                            type: "text",
                            set: setName,
                        },
                        {
                            label: t("login.password_label"),
                            type: "password",
                            set: setPassword,
                        },
                    ].map((item, index) => (
                        <TextField
                            key={index}
                            className={!index ? "!mb-[15px]" : ""}
                            color="secondary"
                            type={item.type}
                            label={item.label}
                            variant="filled"
                            onChange={(e) => {
                                item.set(e.target.value);
                            }}
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
                            label={t("login.restrict_ip")}
                        />
                    </FormGroup>
                    <Box className="my-[15px]">
                        <Typography
                            component={Link}
                            to="/users/verify"
                            className={`${css.link} !font-bold`}
                            sx={(theme) => ({
                                color: `${theme.palette.secondary.main} !important`,
                            })}
                        >
                            {t("login.verify_resend_email")}
                        </Typography>
                        <div className="h-[15px]" />
                        <Typography
                            component={Link}
                            to="/users/forgot"
                            className={`${css.link} !font-bold`}
                            sx={(theme) => ({
                                color: `${theme.palette.secondary.main} !important`,
                            })}
                        >
                            {t("login.forgot_password")}
                        </Typography>
                    </Box>
                    <CAPTCHA ref={captchaRef} />
                    <Box className="flex justify-between">
                        <Button
                            className="flex !text-[18px] !no-underline !normal-case"
                            color="secondary"
                            variant="text"
                            component={Link}
                            sx={(theme) => ({
                                color: `${theme.palette.secondary.main} !important`,
                            })}
                            to={`/users/register${window.location.search}`}
                        >
                            {t("login.register_button")}
                        </Button>
                        <LoadingButton
                            disabled={loading || !formRef.current?.checkValidity()}
                            loading={loading}
                            loadingPosition="start"
                            startIcon={<LoginIcon className="!text-[16px]" />}
                            className="!text-[16px] !normal-case h-[40px]"
                            color="secondary"
                            variant="contained"
                            type="submit"
                        >
                            {t("login.login_button")}
                        </LoadingButton>
                    </Box>
                    <CaptchaNotice />
                </Box>
            </Box>
        </Box>
    );
});
export default Login;
