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

import React, { useEffect, useLayoutEffect, useState } from "react";
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
} from "../../components/AppContextProvider";
import { severity } from "../../types/severity";
import MetahkgLogo from "../../components/logo";
import { Login as LoginIcon } from "@mui/icons-material";
import { api } from "../../lib/api";
import { decodeToken, setTitle } from "../../lib/common";
import { parseError } from "../../lib/parseError";
import { css } from "../../lib/css";

export default function Login() {
    const [menu, setMenu] = useMenu();
    const [, setNotification] = useNotification();
    const isSmallScreen = useIsSmallScreen();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [user, setUser] = useUser();
    const [alert, setAlert] = useState<{ severity: severity; text: string }>({
        severity: "info",
        text: "",
    });
    const [sameIp, setSameIp] = useState(false);
    const navigate = useNavigate();

    const query = queryString.parse(window.location.search);

    useEffect(() => {
        if (query?.continue) {
            setAlert({ severity: "info", text: "Login to continue." });
            setNotification({
                open: true,
                severity: "info",
                text: "Login to continue.",
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useLayoutEffect(() => {
        setTitle("Login | Metahkg");
        menu && setMenu(false);
    }, [menu, setMenu, user]);

    if (user) return <Navigate to="/" replace />;

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setAlert({ severity: "info", text: "Logging in..." });
        setDisabled(true);
        api.usersLogin({
            name,
            password: hash.sha256().update(password).digest("hex"),
            sameIp,
        })
            .then((data) => {
                localStorage.setItem("token", data.token);
                const user = decodeToken(data.token);
                setUser(user);
                navigate(decodeURIComponent(String(query.returnto || "/")), {
                    replace: true,
                });
                setNotification({
                    open: true,
                    severity: "info",
                    text: `Logged in as ${user?.name}.`,
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
                setDisabled(false);
            });
    }

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
                onSubmit={onSubmit}
            >
                <Box className="mx-[50px]">
                    <Box className="flex justify-center items-center">
                        <MetahkgLogo
                            height={50}
                            width={40}
                            svg
                            light
                            className="!mb-[10px]"
                        />
                        <h1 className="text-[25px] !mb-[20px]">Login</h1>
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
                        { label: "Username / Email", type: "text", set: setName },
                        { label: "Password", type: "password", set: setPassword },
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
                            label="Restrict session to same ip address"
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
                            Verify / Resend verification email
                        </Typography>
                    </Box>
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
                            Register
                        </Button>
                        <Button
                            disabled={disabled || !(name && password)}
                            className="!text-[16px] !normal-case h-[40px]"
                            color="secondary"
                            variant="contained"
                            type="submit"
                        >
                            <LoginIcon className="!mr-[5px] !text-[16px]" />
                            Login
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
