import React, { useState } from "react";
import { useIsSmallScreen, useNotification, useUser } from "../ContextProvider";
import { useMenuTitle, useReFetch } from "../MenuProvider";
import {
    Box,
    Button,
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
import { decodeToken, timeToWord_long } from "../../lib/common";
import { api } from "../../lib/api";
import { Save } from "@mui/icons-material";
import { parseError } from "../../lib/parseError";
import { User, UserSex } from "@metahkg/api";

export type UserData = User & { count: number; createdAt?: Date };

interface DataTableProps {
    reqUser: UserData;
    setUser: React.Dispatch<React.SetStateAction<null | UserData>>;
    isSelf: boolean;
}

export default function DataTable(props: DataTableProps) {
    const { reqUser, setUser, isSelf } = props;
    const isSmallScreen = useIsSmallScreen();
    const [, setReFetch] = useReFetch();
    const [, setNotification] = useNotification();
    const [name, setName] = useState(reqUser.name);
    const [sex, setSex] = useState<UserSex>(reqUser.sex);
    const [saveDisabled, setSaveDisabled] = useState(false);
    const [, setClient] = useUser();
    const [, setMenuTitle] = useMenuTitle();

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
                        !/^\S{1,15}$/.test(name) &&
                        "Username must be 1 to 15 characters without spaces."
                    }
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
    ];

    function updateUserInfo() {
        setSaveDisabled(true);
        setNotification({ open: true, severity: "info", text: "Updating user info..." });
        api.userEdit(reqUser.id, { name, sex })
            .then((data) => {
                setSaveDisabled(false);
                setUser(null);

                const { token } = data;

                if (token) {
                    localStorage.setItem("token", token);
                    setClient(decodeToken(token));
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
        <Box
            className="!ml-[50px] !mr-[50px] w-full"
            style={{ maxWidth: isSmallScreen ? "100%" : "70%" }}
        >
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
                <Button
                    className="!mt-[20px] !mb-[10px]"
                    variant="contained"
                    disabled={
                        saveDisabled || name === reqUser.name || sex !== reqUser.sex
                    }
                    color="secondary"
                    onClick={updateUserInfo}
                >
                    <Save />
                    Save
                </Button>
            )}
        </Box>
    );
}
