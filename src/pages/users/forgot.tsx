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
import { Alert, Box, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";
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
import { Send as SendIcon } from "@mui/icons-material";
import CAPTCHA, { CaptchaRefProps } from "../../lib/Captcha";
import { api } from "../../lib/api";
import { setTitle } from "../../lib/common";
import { parseError } from "../../lib/parseError";
import CaptchaNotice from "../../lib/captchaNotice";
import { memo } from "react";
const Forgot = memo(function Forgot() {
    const { t } = useTranslation();
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
    const formRef = useRef<HTMLFormElement>(null);

    const small = width / 2 - 100 <= 450;

    useLayoutEffect(() => {
        setTitle(`${t("forgot.title")} | ${serverConfig?.branding || "Metahkg"}`);
        menu && setMenu(false);
    }, [menu, setMenu, user, serverConfig?.branding, t]);

    if (user) <Navigate to="/" replace />;

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
            setAlert({ severity: "info", text: t("forgot.requesting_reset") });
            setNotification({
                open: true,
                severity: "info",
                text: t("forgot.requesting_reset"),
            });
            api.authForgot({ email, captchaToken })
                .then(() => {
                    setNotification({
                        open: true,
                        text: t("forgot.reset_email_sent"),
                    });
                    setAlert({
                        severity: "success",
                        text: t("forgot.reset_email_sent_instructions"),
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
        },
        [email, serverConfig?.captcha.type, setNotification, t]
    );

    useEffect(() => {
        if (query.email && !user) onSubmit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onSubmit, query.email, user]);

    if (user) return <Navigate to="/" replace />;

    return (
        <Box
            className="flex items-center justify-center min-h-screen w-full"
            sx={{ bgcolor: "primary.dark" }}
        >
            <Box sx={{ width: small ? "100vw" : "50vw" }}>
                <Box
                    className="m-[40px]"
                    component="form"
                    ref={formRef}
                    onSubmit={onSubmit}
                >
                    <Box className="flex justify-center items-center !mb-[20px]">
                        <MetahkgLogo svg light={darkMode} height={50} width={40} />
                        <h1 className="text-[25px] my-0 !ml-[5px]">
                            {t("forgot.title")}
                        </h1>
                    </Box>
                    {alert.text && (
                        <Alert className="!mb-[20px]" severity={alert.severity}>
                            {alert.text}
                        </Alert>
                    )}
                    <TextField
                        label={t("forgot.email_label")}
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
                            disabled={loading || !formRef.current?.checkValidity()}
                            loading={loading}
                            startIcon={<SendIcon className="!text-[16px]" />}
                            loadingPosition="start"
                        >
                            {t("forgot.reset_button")}
                        </LoadingButton>
                        <CaptchaNotice />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
});
export default Forgot;
