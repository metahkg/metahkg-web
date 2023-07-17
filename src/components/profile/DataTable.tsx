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

import React, { useState } from "react";
import {
    useDarkMode,
    useIsSmallScreen,
    useNotification,
    useSession,
} from "../AppContextProvider";
import { useMenuTitle, useReFetch } from "../MenuProvider";
import {
    Box,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
} from "@mui/material";
import { timeToWord_long } from "../../lib/common";
import { api } from "../../lib/api";
import { Save } from "@mui/icons-material";
import { parseError } from "../../lib/parseError";
import { User, UserSex } from "@metahkg/api";
import { Session } from "../../types/session";
import { LoadingButton } from "@mui/lab";
import { regexString } from "../../lib/regex";
import MetahkgLogo from "../logo";

export type UserData = User & {
    count: number;
    createdAt?: Date;
    games?: { tokens: number };
};

interface DataTableProps {
    reqUser: UserData;
    setReqUser: React.Dispatch<React.SetStateAction<null | UserData>>;
    isSelf: boolean;
}

export default function DataTable(props: DataTableProps) {
    const { reqUser, setReqUser, isSelf } = props;
    const isSmallScreen = useIsSmallScreen();
    const [, setReFetch] = useReFetch();
    const [, setNotification] = useNotification();
    const [name, setName] = useState(reqUser.name);
    const [sex, setSex] = useState<UserSex>(reqUser.sex);
    const [saving, setSaveDisabled] = useState(false);
    const [session, setSession] = useSession();
    const [, setMenuTitle] = useMenuTitle();
    const darkMode = useDarkMode();

    const nameValid = /^\S{1,15}$/.test(name);

    const items = [
        {
            title: "Name",
            content: isSelf ? (
                <TextField
                    variant="standard"
                    color="secondary"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                    helperText={
                        name !== reqUser.name &&
                        !nameValid &&
                        "Username must be 1 to 15 characters without spaces."
                    }
                    error={name !== reqUser.name && !nameValid}
                    inputProps={{ pattern: regexString.username }}
                />
            ) : (
                reqUser.name
            ),
        },
        {
            title: "Threads",
            content: reqUser.count,
        },
        {
            title: "Gender",
            content: isSelf ? (
                <Select
                    variant="standard"
                    value={sex}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        if (newValue === "M" || newValue === "F") setSex(newValue);
                    }}
                >
                    <MenuItem value="M">Male</MenuItem>
                    <MenuItem value="F">Female</MenuItem>
                </Select>
            ) : (
                { M: "male", F: "female" }[reqUser.sex] || ""
            ),
        },
        { title: "Role", content: reqUser.role },
        {
            title: "Joined",
            content: `${
                reqUser.createdAt ? timeToWord_long(reqUser.createdAt) : "unknown"
            } ago`,
        },
        {
            title: (
                <React.Fragment>
                    <MetahkgLogo height={20} width={20} svg light={darkMode} /> Tokens
                </React.Fragment>
            ),
            content: reqUser.games?.tokens || 0,
        },
    ];

    function updateUserInfo() {
        setSaveDisabled(true);
        setNotification({ open: true, severity: "info", text: "Updating user info..." });
        api.userEdit(reqUser.id, { name, sex })
            .then((data) => {
                setSaveDisabled(false);
                setReqUser(null);

                const { token } = data;

                if (token) {
                    setSession({ ...session, token } as Session);
                }

                setReFetch(true);
                setMenuTitle("");
                setNotification({
                    open: true,
                    severity: "success",
                    text: `Successfully updated.`,
                });
            })
            .catch((err) => {
                setSaveDisabled(false);
                setNotification({
                    open: true,
                    severity: "error",
                    text: parseError(err),
                });
            });
    }

    return (
        <Box className="w-full" style={{ maxWidth: isSmallScreen ? "100%" : "80%" }}>
            <TableContainer className="w-full" component={Paper}>
                <Table className="w-full" aria-label="simple table">
                    <TableBody>
                        {items.map((item) => (
                            <TableRow
                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                                <TableCell
                                    component="th"
                                    scope="row"
                                    className="!text-[16px]"
                                >
                                    {item.title}
                                </TableCell>
                                <TableCell
                                    component="th"
                                    scope="row"
                                    className="!text-[16px]"
                                >
                                    {item.content}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {isSelf && (
                <LoadingButton
                    className="!mt-[20px] !mb-[10px]"
                    variant="contained"
                    disabled={
                        saving ||
                        (name === reqUser.name && sex === reqUser.sex) ||
                        !nameValid
                    }
                    color="secondary"
                    onClick={updateUserInfo}
                    loading={saving}
                    startIcon={<Save />}
                    loadingPosition="start"
                >
                    Save
                </LoadingButton>
            )}
        </Box>
    );
}
