import React, { useState } from "react";
import { useIsSmallScreen, useNotification, useUser } from "../ContextProvider";
import { useMenuTitle, useReFetch } from "../MenuProvider";
import {
    Box,
    Button,
    Paper,
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
import { User } from "@metahkg/api";

export type UserData = User & { count: number; createdAt?: Date };

interface DataTableProps {
    requestedUser: UserData;
    setUser: React.Dispatch<React.SetStateAction<null | UserData>>;
    isSelf: boolean;
}

export default function DataTable(props: DataTableProps) {
    const { requestedUser, setUser, isSelf } = props;
    const isSmallScreen = useIsSmallScreen();
    const [, setReFetch] = useReFetch();
    const [, setNotification] = useNotification();
    const [name, setName] = useState(requestedUser.name);
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
                />
            ) : (
                requestedUser.name
            ),
        },
        {
            title: "Threads",
            content: requestedUser.count,
        },
        {
            title: "Gender",
            content: { M: "male", F: "female" }[requestedUser.sex] || "",
        },
        { title: "Role", content: requestedUser.role },
        {
            title: "Joined",
            content: `${
                requestedUser.createdAt
                    ? timeToWord_long(requestedUser.createdAt)
                    : "unknown"
            } ago`,
        },
    ];

    function rename() {
        setSaveDisabled(true);
        setNotification({ open: true, text: "Renaming..." });
        api.meRename({ name })
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
                setNotification({ open: true, text: `Name changed to ${name}.` });
            })
            .catch((err) => {
                setSaveDisabled(false);
                setNotification({
                    open: true,
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
                    disabled={saveDisabled || name === requestedUser.name}
                    color="secondary"
                    onClick={rename}
                >
                    <Save />
                    Save
                </Button>
            )}
        </Box>
    );
}
