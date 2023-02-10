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

import React, { useLayoutEffect, useRef, useState } from "react";
import hash from "hash.js";
import {
    Alert,
    Box,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    TextFieldProps,
    Typography,
} from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";
import { Navigate, useNavigate } from "react-router-dom";
import { useMenu } from "../../components/MenuProvider";
import {
    useDarkMode,
    useNotification,
    useReCaptchaSiteKey,
    useUser,
    useWidth,
} from "../../components/AppContextProvider";
import { setTitle } from "../../lib/common";
import { severity } from "../../types/severity";
import MetahkgLogo from "../../components/logo";
import { Close, HowToReg } from "@mui/icons-material";
import { Link } from "react-router-dom";
import queryString from "query-string";
import { api } from "../../lib/api";
import { parseError } from "../../lib/parseError";
import { UserSex } from "@metahkg/api";
import { css } from "../../lib/css";
import ReCaptchaNotice from "../../lib/reCaptchaNotice";
import { LoadingButton } from "@mui/lab";

/**
 * Sex selector
 * @param props.disabled disable the selector
 * @param props.sex the selected sex
 * @param props.setSex: function to update sex
 */
function SexSelect(props: {
    sex: "M" | "F" | undefined;
    setSex: React.Dispatch<React.SetStateAction<"M" | "F" | undefined>>;
    disabled: boolean;
}) {
    const { sex, setSex, disabled } = props;
    const onChange = function (e: SelectChangeEvent) {
        setSex(e.target.value ? "M" : "F");
    };
    return (
        <FormControl required className="!min-w-[200px]">
            <InputLabel color="secondary">Gender</InputLabel>
            <Select
                color="secondary"
                disabled={disabled}
                value={sex}
                label="Gender"
                onChange={onChange}
            >
                <MenuItem value={1}>Male</MenuItem>
                <MenuItem value={0}>Female</MenuItem>
            </Select>
        </FormControl>
    );
}

export default function Register() {
    const [width] = useWidth();
    const [, setNotification] = useNotification();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [sex, setSex] = useState<"M" | "F" | undefined>(undefined);
    const [disable, setDisable] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{ severity: severity; text: string }>({
        severity: "info",
        text: "",
    });
    const [menu, setMenu] = useMenu();
    const [user] = useUser();
    const darkMode = useDarkMode();
    const reCaptchaRef = useRef<ReCAPTCHA>(null);
    const reCaptchaSiteKey = useReCaptchaSiteKey();

    const query = queryString.parse(window.location.search);
    const navigate = useNavigate();

    const small = width / 2 - 100 <= 450;

    useLayoutEffect(() => {
        setTitle("Register | Metahkg");
        menu && setMenu(false);
    }, [menu, setMenu, user]);

    if (user) <Navigate to="/" replace />;

    async function onSubmit(e?: React.FormEvent<HTMLFormElement>) {
        e?.preventDefault();
        const rtoken = await reCaptchaRef.current?.executeAsync();
        if (!rtoken) return;
        setDisable(true);
        setLoading(true);
        setAlert({ severity: "info", text: "Registering..." });
        api.authRegister({
            email,
            name,
            password: hash.sha256().update(password).digest("hex"),
            sex: sex as UserSex,
            rtoken,
        })
            .then(() => {
                setAlert({
                    severity: "success",
                    text: "A link has been sent to your email address. Please click the link to verify.",
                });
                setNotification({
                    open: true,
                    severity: "success",
                    text: "Please click the link sent to your email address.",
                });
            })
            .catch((err) => {
                setAlert({ severity: "error", text: parseError(err) });
                setNotification({
                    open: true,
                    severity: "error",
                    text: parseError(err),
                });
                setDisable(false);
                reCaptchaRef.current?.reset();
            });
        setLoading(false);
    }

    const inputs: TextFieldProps[] = [
        {
            label: "Username",
            onChange: (e) => {
                setName(e.target.value);
            },
            type: "text",
            inputProps: { pattern: "\\S{1,15}" },
            helperText: "Username must be composed of 1-15 characters without spaces",
        },
        {
            label: "Email",
            onChange: (e) => setEmail(e.target.value),
            type: "email",
            inputProps: {
                pattern:
                    "[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@([0-9a-zA-Z][-\\w]*[0-9a-zA-Z]\\.)+[a-zA-Z]{2,9}",
            },
        },
        {
            label: "Password",
            onChange: (e) => setPassword(e.target.value),
            type: "password",
            inputProps: { pattern: "\\S{8,}" },
            helperText: "Password must be at least 8 characters long, without spaces.",
        },
    ];

    return (
        <Box
            className="min-h-screen flex w-full justify-center items-center"
            sx={{
                backgroundColor: "primary.dark",
            }}
        >
            <Box className={`min-h-50v ${small ? "w-100v" : "w-50v"}`}>
                <Box component="form" onSubmit={onSubmit} className="m-[50px]">
                    {query.returnto && (
                        <Box className="flex items-center justify-end">
                            <IconButton
                                onClick={() => {
                                    navigate(String(query.returnto));
                                }}
                            >
                                <Close />
                            </IconButton>
                        </Box>
                    )}
                    <Box className="flex justify-center items-center">
                        <MetahkgLogo
                            svg
                            light={darkMode}
                            height={50}
                            width={40}
                            className="!mb-[10px]"
                        />
                        <h1 className="text-[25px] !mb-[20px] mx-0">Register</h1>
                    </Box>
                    {alert.text && (
                        <Alert
                            className="!mb-[15px] !mt-[10px]"
                            severity={alert.severity}
                        >
                            {alert.text}
                        </Alert>
                    )}
                    {inputs.map((props, index) => (
                        <TextField
                            className="!mb-[15px]"
                            key={index}
                            {...props}
                            color="secondary"
                            disabled={disable}
                            variant="filled"
                            required
                            fullWidth
                        />
                    ))}
                    <SexSelect disabled={disable} sex={sex} setSex={setSex} />
                    <Box className="!mt-[15px] !mb-[15px]">
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
                    <Box className="!mt-[15px]">
                        <ReCAPTCHA
                            theme="dark"
                            sitekey={reCaptchaSiteKey}
                            size="invisible"
                            ref={reCaptchaRef}
                        />
                        <LoadingButton
                            disabled={disable}
                            loading={loading}
                            loadingPosition="start"
                            startIcon={<HowToReg className="!text-[17px]" />}
                            type="submit"
                            className="!text-[16px] !normal-case h-[40px]"
                            color="secondary"
                            variant="contained"
                        >
                            Register
                        </LoadingButton>
                        <ReCaptchaNotice />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
