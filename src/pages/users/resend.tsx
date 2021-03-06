import React, { useEffect, useLayoutEffect, useState } from "react";
import { Alert, Box, Button, TextField } from "@mui/material";
import {
    useNotification,
    useReCaptchaSiteKey,
    useUser,
    useWidth,
} from "../../components/ContextProvider";
import MetahkgLogo from "../../components/logo";
import { severity } from "../../types/severity";
import { useMenu } from "../../components/MenuProvider";
import { Navigate } from "react-router-dom";
import queryString from "query-string";
import EmailValidator from "email-validator";
import { Send as SendIcon } from "@mui/icons-material";
import ReCAPTCHA from "react-google-recaptcha";
import { api } from "../../lib/api";
import { setTitle } from "../../lib/common";
import { parseError } from "../../lib/parseError";

declare const grecaptcha: { reset: () => void };

export default function Verify() {
    const [menu, setMenu] = useMenu();
    const [, setNotification] = useNotification();
    const [width] = useWidth();
    const [alert, setAlert] = useState<{ severity: severity; text: string }>({
        severity: "info",
        text: "",
    });
    const [disabled, setDisabled] = useState(false);
    const query = queryString.parse(window.location.search);
    const [email, setEmail] = useState(String(query.email || ""));
    const [rtoken, setRtoken] = useState("");
    const [user] = useUser();
    const reCaptchaSiteKey = useReCaptchaSiteKey();

    const small = width / 2 - 100 <= 450;

    useLayoutEffect(() => {
        setTitle("Resend Verification Email | Metahkg");
        menu && setMenu(false);
    }, [menu, setMenu, user]);

    if (user) <Navigate to="/" replace />;

    function onSubmit(e?: React.FormEvent<HTMLFormElement>) {
        e?.preventDefault();
        setAlert({ severity: "info", text: "Requesting resend..." });
        setNotification({ open: true, text: "Requesting resend..." });
        setDisabled(true);
        api.usersResend({ email, rtoken })
            .then(() => {
                setNotification({
                    open: true,
                    text: `Verification email sent.`,
                });
                setAlert({
                    severity: "success",
                    text: "Verification email sent.",
                });
                grecaptcha.reset();
                setRtoken("");
                setDisabled(false);
            })
            .catch((err) => {
                setAlert({
                    severity: "error",
                    text: parseError(err),
                });
                setNotification({
                    open: true,
                    text: parseError(err),
                });
                grecaptcha.reset();
                setRtoken("");
                setDisabled(false);
            });
    }

    useEffect(() => {
        if (query.email && !user) onSubmit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Box
            className="flex align-center justify-center min-height-fullvh fullwidth"
            sx={{ bgcolor: "primary.dark" }}
        >
            <Box sx={{ width: small ? "100vw" : "50vw" }}>
                <Box className="m40" component="form" onSubmit={onSubmit}>
                    <Box className="flex justify-center align-center">
                        <MetahkgLogo svg light height={50} width={40} className="mb10" />
                        <h1 className="font-size-25 mb20 nohmargin">
                            Resend Verification Email
                        </h1>
                    </Box>
                    {alert.text && (
                        <Alert className="mb20" severity={alert.severity}>
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
                    <Box
                        className={`${
                            small
                                ? ""
                                : "flex fullwidth align-center justify-space-between"
                        } mt20`}
                    >
                        <ReCAPTCHA
                            theme="dark"
                            sitekey={reCaptchaSiteKey}
                            onChange={(token) => {
                                setRtoken(token || "");
                            }}
                        />
                        <Button
                            variant="contained"
                            className={`font-size-16-force notexttransform${
                                small ? " mt20" : ""
                            }`}
                            color="secondary"
                            type="submit"
                            disabled={
                                disabled ||
                                !(email && rtoken && EmailValidator.validate(email))
                            }
                        >
                            <SendIcon className="mr5 font-size-16-force" />
                            Resend
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
