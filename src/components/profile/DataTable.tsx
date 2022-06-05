import React, { useState } from "react";
import { useIsSmallScreen, useNotification, useUser } from "../ContextProvider";
import { useData } from "../MenuProvider";
import { useParams } from "react-router-dom";
import {
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
}

export default function DataTable(props: DataTableProps) {
    const { requestedUser, setUser } = props;
    const isSmallScreen = useIsSmallScreen();
    const [, setData] = useData();
    const [, setNotification] = useNotification();
    const [name, setName] = useState(requestedUser.name);
    const [sex, setSex] = useState<"M" | "F">(requestedUser.sex);
    const [saveDisabled, setSaveDisabled] = useState(false);
    const [, setClient] = useUser();

    const params = useParams();
    const items = [
        {
            title: "Name",
            content:
                params.id === "self" ? (
                    <TextField
                        variant="standard"
                        color="secondary"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                    />
                ) : (
                    props.requestedUser.name
                ),
        },
        {
            title: "Threads",
            content: props.requestedUser.count,
        },
        {
            title: "Gender",
            content:
                params.id === "self" ? (
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
                    { M: "male", F: "female" }[props.requestedUser.sex] || ""
                ),
        },
        { title: "Role", content: props.requestedUser.role },
        {
            title: "Joined",
            content: `${timeToWord_long(props.requestedUser.createdAt)} ago`,
        },
    ];

    function editProfile() {
        setSaveDisabled(true);
        setNotification({ open: true, text: "Saving..." });
        api.users
            .editprofile({ name, sex })
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
        <div
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
            {params.id === "self" && (
                <Button
                    className="mt20 mb10"
                    variant="contained"
                    disabled={
                        saveDisabled ||
                        (name === props.requestedUser.name &&
                            sex === props.requestedUser.sex)
                    }
                    color="secondary"
                    onClick={editProfile}
                >
                    <Save />
                    Save
                </Button>
            )}
        </div>
    );
}
