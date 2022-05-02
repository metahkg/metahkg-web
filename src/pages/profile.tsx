import React, { useEffect, useState } from "react";
import "./css/profile.css";
import {
    Box,
    Button,
    LinearProgress,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    Tooltip,
} from "@mui/material";
import { AxiosError } from "axios";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
    useCat,
    useData,
    useId,
    useMenu,
    useProfile,
    useRecall,
    useSearch,
    useSelected,
    useMenuTitle,
} from "../components/MenuProvider";
import UploadAvatar from "../components/uploadavatar";
import { setTitle, timetoword_long } from "../lib/common";
import { Link } from "react-router-dom";
import {
    useBack,
    useNotification,
    useUser,
    useIsSmallScreen,
} from "../components/ContextProvider";
import { Save } from "@mui/icons-material";
import { api } from "../lib/api";

/* It's a function that returns a table with the user's information. */
interface DataTableProps {
    user: {
        name: string;
        count: number;
        sex: "M" | "F";
        role: "user" | "admin";
        createdAt: string;
    };
    setUser: React.Dispatch<React.SetStateAction<any>>;
}
function DataTable(props: DataTableProps) {
    const isSmallScreen = useIsSmallScreen();
    const [, setData] = useData();
    const [, setNotification] = useNotification();
    const [name, setName] = useState(props.user.name);
    const [sex, setSex] = useState<"M" | "F">(props.user.sex);
    const [saveDisabled, setSaveDisabled] = useState(false);
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
                    props.user.name
                ),
        },
        {
            title: "Posts",
            content: props.user.count,
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
                    { M: "male", F: "female" }[props.user.sex] || ""
                ),
        },
        { title: "Role", content: props.user.role },
        {
            title: "Joined",
            content: `${timetoword_long(props.user.createdAt)} ago`,
        },
    ];

    function editprofile() {
        setSaveDisabled(true);
        setNotification({ open: true, text: "Saving..." });
        api.post("/users/editprofile", { name: name, sex: sex })
            .then((res) => {
                setSaveDisabled(false);
                props.setUser({});
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
                        (name === props.user.name && sex === props.user.sex)
                    }
                    color="secondary"
                    onClick={editprofile}
                >
                    <Save />
                    Save
                </Button>
            )}
        </div>
    );
}

/**
 * This function renders the profile page
 */
/* It's a function that renders the profile page. */
export default function Profile() {
    const params = useParams();
    const [profile, setProfile] = useProfile();
    const [search, setSearch] = useSearch();
    const [recall, setRecall] = useRecall();
    const [user, setUser] = useState<any>({});
    const [menu, setMenu] = useMenu();
    const isSmallScreen = useIsSmallScreen();
    const [, setData] = useData();
    const [, setMenuTitle] = useMenuTitle();
    const [id, setId] = useId();
    const [cat, setCat] = useCat();
    const [selected, setSelected] = useSelected();
    const [back, setBack] = useBack();
    const [, setNotification] = useNotification();
    const [client] = useUser();
    const navigate = useNavigate();
    /* It's a way to make sure that the component is re-rendered when the user changes the profile. */
    useEffect(() => {
        if (!(params.id === "self" && !client) && !Object.keys(user).length) {
            api.get(`/profile/${Number(params.id) || "self"}`)
                .then((res) => {
                    setUser(res.data);
                    setTitle(`${res.data.name} | Metahkg`);
                })
                .catch((err: AxiosError) => {
                    setNotification({ open: true, text: err?.response?.data?.error });
                    err?.response?.status === 404 && navigate("/404", { replace: true });
                    err?.response?.status === 401 && navigate("/401", { replace: true });
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id, user]);

    /**
     * Clear the data and reset the title and selected index.
     */
    function cleardata() {
        setData([]);
        setMenuTitle("");
        selected && setSelected(0);
    }

    if (params?.id === "self" && !client) return <Navigate to="/" replace />;
    back !== window.location.pathname && setBack(window.location.pathname);
    !menu && !isSmallScreen && setMenu(true);
    menu && isSmallScreen && setMenu(false);
    (profile !== (Number(params.id) || "self") || search) && cleardata();
    profile !== (Number(params.id) || "self") && setProfile(Number(params.id) || "self");
    search && setSearch(false);
    recall && setRecall(false);
    id && setId(0);
    cat && setCat(0);
    return (
        <Box
            className="flex min-height-fullvh profile-root fullwidth"
            sx={{
                backgroundColor: "primary.dark",
            }}
        >
            {!Object.keys(user).length ? (
                <LinearProgress className="fullwidth" color="secondary" />
            ) : (
                <Paper className="nobgimage max-height-fullvh overflow-auto">
                    <Box className="flex min-height-fullvh justify-center align-center flex-dir-column">
                        <Box
                            className="flex justify-center align-center max-width-full mt20"
                            sx={{
                                width: isSmallScreen ? "100vw" : "70vw",
                            }}
                        >
                            <img
                                src={`/api/avatars/${user.id}`}
                                alt="User avatar"
                                height={isSmallScreen ? 150 : 200}
                                width={isSmallScreen ? 150 : 200}
                            />
                            <br />
                            <div
                                className="ml20 flex justify-center profile-toptextdiv"
                                style={{
                                    flexDirection:
                                        params.id === "self" ? "column" : "row",
                                }}
                            >
                                <h1 className="font-size-30 profile-toptext">
                                    <div
                                        className="overflow-hidden"
                                        style={{
                                            maxWidth: isSmallScreen
                                                ? "calc(100vw - 250px)"
                                                : "calc(70vw - 350px)",
                                        }}
                                    >
                                        <span
                                            className="overflow-hidden text-overflow-ellipsis nowrap"
                                            style={{
                                                color:
                                                    user.sex === "M" ? "#34aadc" : "red",
                                            }}
                                        >
                                            {user.name}
                                        </span>
                                    </div>
                                    #{user.id}
                                </h1>
                                <div
                                    className="profile-uploaddiv"
                                    style={{
                                        marginTop: params.id === "self" ? 25 : 0,
                                    }}
                                >
                                    {params.id === "self" && (
                                        <Tooltip title="jpg / png / svg supported" arrow>
                                            <UploadAvatar
                                                onUpload={() => {
                                                    setNotification({
                                                        open: true,
                                                        text: "Uploading...",
                                                    });
                                                }}
                                                onSuccess={() => {
                                                    window.location.reload();
                                                }}
                                                onError={(err) => {
                                                    setNotification({
                                                        open: true,
                                                        text: `Upload failed: ${
                                                            err.response?.data?.error ||
                                                            err.response?.data ||
                                                            ""
                                                        }`,
                                                    });
                                                }}
                                            />
                                        </Tooltip>
                                    )}
                                </div>
                            </div>
                        </Box>
                        <Box className="flex mt20 mb10 fullwidth font justify-center">
                            <DataTable setUser={setUser} user={user} />
                        </Box>
                        {isSmallScreen && (
                            <div className="mt20">
                                <Link
                                    className="notextdecoration"
                                    to={`/history/${params.id}`}
                                >
                                    <Button
                                        className="font-size-16"
                                        variant="text"
                                        color="secondary"
                                    >
                                        View History
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </Box>
                </Paper>
            )}
        </Box>
    );
}
