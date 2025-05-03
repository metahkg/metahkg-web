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

import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useIsSmallScreen, useNotification, useSession } from "../AppContextProvider";
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
import { User, Sex } from "@metahkg/api";
import { Session } from "../../types/session";
import { LoadingButton } from "@mui/lab";
import { regexString } from "../../lib/regex";
import { memo } from "react";

export type UserData = User & {
    count: number;
    createdAt?: Date;
};

interface DataTableProps {
    reqUser: UserData;
    setReqUser: React.Dispatch<React.SetStateAction<null | UserData>>;
    isSelf: boolean;
}
const DataTable = memo(function DataTable(props: DataTableProps) {
    const { t } = useTranslation();
    const { reqUser, setReqUser, isSelf } = props;
    const isSmallScreen = useIsSmallScreen();
    const [, setReFetch] = useReFetch();
    const [, setNotification] = useNotification();
    const [name, setName] = useState(reqUser.name);
    const [sex, setSex] = useState<Sex>(reqUser.sex);
    const [saving, setSaveDisabled] = useState(false);
    const [session, setSession] = useSession();
    const [, setMenuTitle] = useMenuTitle();

    const nameValid = useMemo(() => /^\S{1,15}$/.test(name), [name]);

    const items = useMemo(
        () => [
            {
                title: t("profile.data_table.name_title"),
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
                            t("profile.data_table.name_helper_text")
                        }
                        error={name !== reqUser.name && !nameValid}
                        inputProps={{ pattern: regexString.username }}
                    />
                ) : (
                    reqUser.name
                ),
            },
            {
                title: t("profile.data_table.threads_title"),
                content: reqUser.count,
            },
            {
                title: t("profile.data_table.gender_title"),
                content: isSelf ? (
                    <Select
                        variant="standard"
                        value={sex}
                        onChange={(e) => {
                            const newValue = e.target.value;
                            if (newValue === "M" || newValue === "F") setSex(newValue);
                        }}
                    >
                        <MenuItem value="M">
                            {t("profile.data_table.gender_male")}
                        </MenuItem>
                        <MenuItem value="F">
                            {t("profile.data_table.gender_female")}
                        </MenuItem>
                    </Select>
                ) : (
                    {
                        M: t("profile.data_table.gender_male").toLowerCase(),
                        F: t("profile.data_table.gender_female").toLowerCase(),
                    }[reqUser.sex] || ""
                ),
            },
            { title: t("profile.data_table.role_title"), content: reqUser.role },
            {
                title: t("profile.data_table.joined_title"),
                content: `${
                    reqUser.createdAt
                        ? timeToWord_long(reqUser.createdAt)
                        : t("profile.data_table.joined_unknown")
                }${t("profile.data_table.joined_ago")}`,
            },
        ],
        [
            isSelf,
            name,
            nameValid,
            reqUser.count,
            reqUser.createdAt,
            reqUser.name,
            reqUser.role,
            reqUser.sex,
            sex,
            t,
        ]
    );

    const updateUserInfo = useCallback(() => {
        setSaveDisabled(true);
        setNotification({
            open: true,
            severity: "info",
            text: t("profile.data_table.updating_notification"),
        });
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
                    text: t("profile.data_table.updated_notification"),
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
    }, [
        name,
        reqUser.id,
        session,
        setMenuTitle,
        setNotification,
        t,
        setReFetch,
        setReqUser,
        setSession,
        sex,
    ]);

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
                    {t("profile.data_table.save_button")}
                </LoadingButton>
            )}
        </Box>
    );
});
export default DataTable;
