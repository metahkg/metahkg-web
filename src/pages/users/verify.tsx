import React, { useEffect, useLayoutEffect, useState } from "react";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { useNotification, useUser, useWidth } from "../../components/ContextProvider";
import MetahkgLogo from "../../components/logo";
import { severity } from "../../types/severity";
import { useMenu } from "../../components/MenuProvider";
import { Link, Navigate, useNavigate } from "react-router-dom";
import queryString from "query-string";
import EmailValidator from "email-validator";
import { HowToReg } from "@mui/icons-material";
import { api, resetApi } from "../../lib/api";
import { decodeToken, setTitle } from "../../lib/common";
import { parseError } from "../../lib/parseError";

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
    const [email, setEmail] = useState(decodeURIComponent(String(query.email || "")));
    const [code, setCode] = useState(decodeURIComponent(String(query.code || "")));
    const [user, setUser] = useUser();
    const navigate = useNavigate();

    const small = width / 2 - 100 <= 450;

    function onSubmit(e?: React.FormEvent<HTMLFormElement>) {
        e?.preventDefault();
        setAlert({ severity: "info", text: "Verifying..." });
        setNotification({ open: true, text: "Verifying..." });
        setDisabled(true);
        api.users
            .verify({ email, code })
            .then((res) => {
                localStorage.setItem("token", res.data.token);
                const user = decodeToken(res.data.token);
                setUser(user);
                resetApi();
                setNotification({
                    open: true,
                    text: `Logged in as ${user?.name}.`,
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
                    text: parseError(err),
                });
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
            className="flex align-center justify-center min-height-fullvh fullwidth"
            sx={{ bgcolor: "primary.dark" }}
        >
            <Box sx={{ width: small ? "100vw" : "50vw" }}>
                <Box className="m40" component="form" onSubmit={onSubmit}>
                    <Box className="flex justify-center align-center">
                        <MetahkgLogo svg light height={50} width={40} className="mb10" />
                        <h1 className="font-size-25 mb20 nohmargin">Verify</h1>
                    </Box>
                    {alert.text && (
                        <Alert className="mb20" severity={alert.severity}>
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
                            className={!index ? "mb15" : ""}
                            onChange={(e) => {
                                item.set(e.target.value);
                            }}
                            variant="filled"
                            color="secondary"
                            required
                            fullWidth
                        />
                    ))}
                    <Box className="mt15 mb15">
                        <Typography
                            component={Link}
                            sx={(theme) => ({
                                color: `${theme.palette.secondary.main} !important`,
                            })}
                            className="link bold-force"
                            to="/users/resend"
                        >
                            Resend verification email
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        className="font-size-16-force notexttransform"
                        color="secondary"
                        type="submit"
                        disabled={
                            disabled || !(email && code && EmailValidator.validate(email))
                        }
                    >
                        <HowToReg className="mr5" />
                        Verify
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
