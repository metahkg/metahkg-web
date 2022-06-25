import React, { useState } from "react";
import { useIsSmallScreen, useNotification, useUser } from "../ContextProvider";
import { useData } from "../MenuProvider";
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
import { api, resetApi } from "../../lib/api";
import { Save } from "@mui/icons-material";

export interface UserData {
    id: number;
    name: string;
    count: number;
    sex: "M" | "F";
    role: "user" | "admin";
    createdAt: string;
}

interface DataTableProps {
    requestedUser: UserData;
    setUser: React.Dispatch<React.SetStateAction<null | UserData>>;
    isSelf: boolean;
}

export default function DataTable(props: DataTableProps) {
    const { requestedUser, setUser, isSelf } = props;
    const isSmallScreen = useIsSmallScreen();
    const [, setData] = useData();
    const [, setNotification] = useNotification();
    const [name, setName] = useState(requestedUser.name);
    const [saveDisabled, setSaveDisabled] = useState(false);
    const [, setClient] = useUser();

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
            content: `${timeToWord_long(requestedUser.createdAt)} ago`,
        },
    ];

    function rename() {
        setSaveDisabled(true);
        setNotification({ open: true, text: "Renaming..." });
        api.users
            .rename({ name })
            .then((res) => {
                setSaveDisabled(false);
                setUser(null);

                const { token } = res.data;

                if (token) {
                    localStorage.setItem("token", token);
                    setClient(decodeToken(token));
                    resetApi();
                }

                setData([]);
                setNotification({ open: true, text: res.data?.response });
            })
            .catch((err) => {
                setSaveDisabled(false);
                setNotification({
                    open: true,
                    text: err.response?.data?.error || err.response?.data || "",
                });
            });
    }

    return (
        <Box
            className="ml50 mr50 fullwidth"
            style={{ maxWidth: isSmallScreen ? "100%" : "70%" }}
        >
            <TableContainer className="fullwidth" component={Paper}>
                <Table className="fullwidth" aria-label="simple table">
                    <TableBody>
                        {items.map((item) => (
                            <TableRow
                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                                <TableCell
                                    component="th"
                                    scope="row"
                                    className="font-size-16-force"
                                >
                                    {item.title}
                                </TableCell>
                                <TableCell
                                    component="th"
                                    scope="row"
                                    className="font-size-16-force"
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
                    className="mt20 mb10"
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
