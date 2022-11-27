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
import { useNotification, useUser, useWidth } from "../../components/AppContextProvider";
import MetahkgLogo from "../../components/logo";
import { severity } from "../../types/severity";
import { useMenu } from "../../components/MenuProvider";
import { Link, Navigate, useNavigate } from "react-router-dom";
import queryString from "query-string";
import EmailValidator from "email-validator";
import { HowToReg } from "@mui/icons-material";
import { api } from "../../lib/api";
import { decodeToken, setTitle } from "../../lib/common";
import { parseError } from "../../lib/parseError";
import { css } from "../../lib/css";

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
    const [sameIp, setSameIp] = useState(false);
    const navigate = useNavigate();

    const small = width / 2 - 100 <= 450;

    function onSubmit(e?: React.FormEvent<HTMLFormElement>) {
        e?.preventDefault();
        setAlert({ severity: "info", text: "Verifying..." });
        setNotification({ open: true, severity: "info", text: "Verifying..." });
        setDisabled(true);
        api.usersVerify({ email, code, sameIp })
            .then((data) => {
                localStorage.setItem("token", data.token);
                const user = decodeToken(data.token);
                setUser(user);
                setNotification({
                    open: true,
                    severity: "info",
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
                    severity: "error",
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
            className="flex items-center justify-center min-h-screen w-full"
            sx={{ bgcolor: "primary.dark" }}
        >
            <Box className={small ? "w-100v" : "w-50v"}>
                <Box className="m-[40px]" component="form" onSubmit={onSubmit}>
                    <Box className="flex justify-center items-center">
                        <MetahkgLogo
                            svg
                            light
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
                    <Button
                        variant="contained"
                        className="!text-[16px] !normal-case"
                        color="secondary"
                        type="submit"
                        disabled={
                            disabled || !(email && code && EmailValidator.validate(email))
                        }
                    >
                        <HowToReg className="!mr-[5px]" />
                        Verify
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
