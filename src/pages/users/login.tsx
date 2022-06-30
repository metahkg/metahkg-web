import "../../css/pages/users/login.css";
import React, { useEffect, useState } from "react";
import { Alert, Box, Button, TextField } from "@mui/material";
import hash from "hash.js";
import { Link } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";
import queryString from "query-string";
import { useMenu } from "../../components/MenuProvider";
import {
    useNotification,
    useSettings,
    useIsSmallScreen,
    useUser,
} from "../../components/ContextProvider";
import { severity } from "../../types/severity";
import MetahkgLogo from "../../components/logo";
import { Login as LoginIcon } from "@mui/icons-material";
import { api, resetApi } from "../../lib/api";
import { decodeToken, setTitle } from "../../lib/common";
import { parseError } from "../../lib/parseError";

export default function Login() {
    const navigate = useNavigate();
    const [menu, setMenu] = useMenu();
    const [, setNotification] = useNotification();
    const [settings] = useSettings();
    const isSmallScreen = useIsSmallScreen();
    const [name, setName] = useState("");
    const [pwd, setPwd] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [user, setUser] = useUser();
    const [alert, setAlert] = useState<{ severity: severity; text: string }>({
        severity: "info",
        text: "",
    });
    useEffect(() => {
        if (query?.continue) {
            setAlert({ severity: "info", text: "Login to continue." });
            setNotification({ open: true, text: "Login in to continue." });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (user) return <Navigate to="/" replace />;

    menu && setMenu(false);
    setTitle("Login | Metahkg");
    const query = queryString.parse(window.location.search);

    function login() {
        setAlert({ severity: "info", text: "Logging in..." });
        setDisabled(true);
        api.users
            .login({
                userNameOrEmail: name,
                password: hash.sha256().update(pwd).digest("hex"),
            })
            .then((res) => {
                localStorage.setItem("token", res.data.token);
                const user = decodeToken(res.data.token);
                setUser(user);
                resetApi();
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
            >
                <div className="ml50 mr50">
                    <div className="flex fullwidth justify-flex-end">
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
                    </div>
                    <div className="flex justify-center align-center">
                        <MetahkgLogo height={50} width={40} svg light className="mb10" />
                        <h1 className="font-size-25 mb20">Login</h1>
                    </div>
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
                    <h4>
                        <Link
                            style={{ color: settings.secondaryColor?.main || "#f5bd1f" }}
                            className="link"
                            to="/users/verify"
                        >
                            Verify / Resend verification email?
                        </Link>
                    </h4>
                    <Button
                        disabled={disabled || !(name && pwd)}
                        className="font-size-16-force notexttransform login-btn"
                        color="secondary"
                        variant="contained"
                        onClick={login}
                    >
                        <LoginIcon className="mr5 font-size-16-force" />
                        Login
                    </Button>
                </div>
            </Box>
        </Box>
    );
}
