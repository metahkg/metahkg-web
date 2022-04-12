import React, { useEffect, useState } from "react";
import { Alert, Box, Button, TextField } from "@mui/material";
import { useNotification, useSettings, useWidth } from "../../components/ContextProvider";
import MetahkgLogo from "../../components/logo";
import { severity } from "../../types/severity";
import { useMenu } from "../../components/MenuProvider";
import { Link, Navigate, useNavigate } from "react-router-dom";
import queryString from "query-string";
import EmailValidator from "email-validator";
import axios from "axios";
import { HowToReg } from "@mui/icons-material";

export default function Verify() {
    const [menu, setMenu] = useMenu();
    const [, setNotification] = useNotification();
    const [width] = useWidth();
    const [alert, setAlert] = useState<{ severity: severity; text: string }>({
        severity: "info",
        text: "",
    });
    const [disabled, setDisabled] = useState(false);
    const [settings] = useSettings();
    const query = queryString.parse(window.location.search);
    const [email, setEmail] = useState(decodeURIComponent(String(query.email || "")));
    const [code, setCode] = useState(decodeURIComponent(String(query.code || "")));
    const navigate = useNavigate();

    function verify() {
        setAlert({ severity: "info", text: "Verifying..." });
        setNotification({ open: true, text: "Verifying..." });
        setDisabled(true);
        axios
            .post(
                "/api/users/verify",
                {
                    email: email,
                    code: code,
                },
                {
                    headers: { authorization: localStorage.getItem("token") || "" },
                }
            )
            .then((res) => {
                localStorage.setItem("user", res.data.user);
                localStorage.setItem("id", res.data.id);
                localStorage.setItem("token", res.data.token);
                setNotification({
                    open: true,
                    text: `Logged in as ${res.data.user}.`,
                });
                navigate(String(query.returnto || "/"));
            })
            .catch((err) => {
                setDisabled(false);
                setAlert({
                    severity: "error",
                    text: err?.response?.data?.error || err?.response?.data || "",
                });
                setNotification({
                    open: true,
                    text: err?.response?.data?.error || err?.response?.data || "",
                });
            });
    }

    useEffect(() => {
        if (query.code && query.email && !localStorage.user) verify();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    if (localStorage.user) return <Navigate to="/" replace />;
    menu && setMenu(false);
    document.title = "Verify | Metahkg";
    const small = width / 2 - 100 <= 450;
    return (
        <Box
            className="flex align-center justify-center min-height-fullvh fullwidth"
            sx={{ bgcolor: "primary.dark" }}
        >
            <Box sx={{ width: small ? "100vw" : "50vw" }}>
                <div className="m40">
                    <div className="flex justify-center align-center">
                        <MetahkgLogo svg light height={50} width={40} className="mb10" />
                        <h1 className="font-size-25 mb20 nohmargin">Verify</h1>
                    </div>
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
                            color="secondarysettings.secondaryColor?.main || "#f5bd1f"
                            required
                            fullWidth
                        />
                    ))}
                    <h4>
                        <Link
                            style={{ color: settings.secondaryColor?.main }}
                            className="link"
                            to="/users/resend"
                        >
                            Resend verification email?
                        </Link>
                    </h4>
                    <Button
                        variant="contained"
                        className="font-size-16-force notexttransform"
                        color="secondary"
                        onClick={verify}
                        disabled={
                            disabled || !(email && code && EmailValidator.validate(email))
                        }
                    >
                        <HowToReg className="mr5" />
                        Verify
                    </Button>
                </div>
            </Box>
        </Box>
    );
}
