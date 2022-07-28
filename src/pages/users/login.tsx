import "../../css/pages/users/login.css";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import hash from "hash.js";
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import { useMenu } from "../../components/MenuProvider";
import {
    useNotification,
    useIsSmallScreen,
    useUser,
} from "../../components/ContextProvider";
import { severity } from "../../types/severity";
import MetahkgLogo from "../../components/logo";
import { Login as LoginIcon } from "@mui/icons-material";
import { api } from "../../lib/api";
import { decodeToken, setTitle } from "../../lib/common";
import { parseError } from "../../lib/parseError";

export default function Login() {
    const [menu, setMenu] = useMenu();
    const [, setNotification] = useNotification();
    const isSmallScreen = useIsSmallScreen();
    const [name, setName] = useState("");
    const [pwd, setPwd] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [user, setUser] = useUser();
    const [alert, setAlert] = useState<{ severity: severity; text: string }>({
        severity: "info",
        text: "",
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (query?.continue) {
            setAlert({ severity: "info", text: "Login to continue." });
            setNotification({ open: true, text: "Login in to continue." });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useLayoutEffect(() => {
        setTitle("Login | Metahkg");
        menu && setMenu(false);
    }, [menu, setMenu, user]);

    if (user) return <Navigate to="/" replace />;

    const query = queryString.parse(window.location.search);

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setAlert({ severity: "info", text: "Logging in..." });
        setDisabled(true);
        api.usersLogin({ name, pwd: hash.sha256().update(pwd).digest("hex") })
            .then((data) => {
                localStorage.setItem("token", data.token);
                const user = decodeToken(data.token);
                setUser(user);
                navigate(decodeURIComponent(String(query.returnto || "/")), {
                    replace: true,
                });
                setNotification({ open: true, text: `Logged in as ${user?.name}.` });
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
                setDisabled(false);
            });
    }

    return (
        <Box
            className="flex align-center justify-center fullwidth min-height-fullvh"
            sx={{
                backgroundColor: "primary.dark",
            }}
        >
            <Box
                className="login-main-box"
                sx={{
                    width: isSmallScreen ? "100vw" : "50vw",
                }}
                component="form"
                onSubmit={onSubmit}
            >
                <Box className="ml50 mr50">
                    <Box className="flex fullwidth justify-flex-end">
                        <Link
                            className="notextdecoration"
                            to={`/users/register${window.location.search}`}
                        >
                            <Button
                                className="flex notexttransform font-size-18-force"
                                color="secondary"
                                variant="text"
                            >
                                <strong>Register</strong>
                            </Button>
                        </Link>
                    </Box>
                    <Box className="flex justify-center align-center">
                        <MetahkgLogo height={50} width={40} svg light className="mb10" />
                        <h1 className="font-size-25 mb20">Login</h1>
                    </Box>
                    {alert.text && (
                        <Alert className="mb15 mt10" severity={alert.severity}>
                            {alert.text}
                        </Alert>
                    )}
                    {[
                        { label: "Username / Email", type: "text", set: setName },
                        { label: "Password", type: "password", set: setPwd },
                    ].map((item, index) => (
                        <TextField
                            key={index}
                            className={!index ? "mb15" : ""}
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
                    <Box className="mt15 mb15">
                        <Typography
                            component={Link}
                            to="/users/verify"
                            className="link bold-force"
                            sx={(theme) => ({
                                color: `${theme.palette.secondary.main} !important`,
                            })}
                        >
                            Verify / Resend verification email
                        </Typography>
                    </Box>
                    <Button
                        disabled={disabled || !(name && pwd)}
                        className="font-size-16-force notexttransform login-btn"
                        color="secondary"
                        variant="contained"
                        type="submit"
                    >
                        <LoginIcon className="mr5 font-size-16-force" />
                        Login
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
