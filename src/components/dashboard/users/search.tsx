import { Search } from "@mui/icons-material";
import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    useDarkMode,
    useIsSmallScreen,
    useNotification,
    useSettings,
} from "../../AppContextProvider";
import { LoadingButton } from "@mui/lab";
import { api } from "../../../lib/api";
import { parseError } from "../../../lib/parseError";
import { Ban, Mute, Role, Sex, User } from "@metahkg/api";
import AlertDialog from "../../../lib/alertDialog";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import Theme from "../../../theme";
import { memo } from "react";
const SearchUsers = memo(function SearchUsers() {
    const [, setNotification] = useNotification();
    const [settings] = useSettings();
    const darkMode = useDarkMode();
    const [searchSettings, setSearchSettings] = useState<{
        id?: number;
        name?: string;
        email?: string;
        sex?: Sex;
        role?: Role;
        muted?: boolean;
        banned?: boolean;
    } | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<
        (User & { createdAt: Date; mute?: Mute; ban?: Ban })[] | null
    >();
    const [page, setPage] = useState<number>(1);
    const [count, setCount] = useState(0);
    const [reload, setReload] = useState(false);
    const [muteDialogOpen, setMuteDialogOpen] = useState(false);
    const [banDialogOpen, setBanDialogOpen] = useState(false);
    const [muteUser, setMuteUser] = useState<{
        id?: number;
        reason?: string;
        exp?: Date;
    } | null>(null);
    const [banUser, setBanUser] = useState<{
        id?: number;
        reason?: string;
        exp?: Date;
    } | null>(null);
    const isSmallScreen = useIsSmallScreen();
    const search = useCallback(() => {
        if (searchSettings) {
            setLoading(true);
            const { id, name, email, sex, role, muted, banned } = searchSettings;
            let searchPage = page;
            api.users(id, name, email, sex, role, muted, banned, searchPage, 15)
                .then(({ count, users }) => {
                    setUsers(users);
                    setCount(count);
                    setLoading(false);
                    setTimeout(() => {
                        resultsRef.current?.scrollIntoView();
                    });
                })
                .catch((err) => {
                    setLoading(false);
                    setNotification({
                        open: true,
                        severity: "error",
                        text: parseError(err),
                    });
                });
        }
    }, [searchSettings, setNotification, page]);

    useEffect(() => {
        if (searchSettings) {
            search();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reload]);

    return (
        <Box
            onSubmit={(e) => {
                e?.preventDefault();
                setPage(1);
                setReload(!reload);
            }}
            component="form"
            ref={formRef}
        >
            <AlertDialog
                open={muteDialogOpen}
                setOpen={setMuteDialogOpen}
                title={`Mute user ${
                    users?.find((user) => user.id === muteUser?.id)?.name
                } (#${muteUser?.id})?`}
                body={(state, setState, closeDialog) => (
                    <Grid container spacing={2} sx={{ my: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                label="Reason"
                                color="secondary"
                                required
                                onChange={(e) => {
                                    setMuteUser({ ...muteUser, reason: e.target.value });
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Theme
                                    mode={darkMode ? "dark" : "light"}
                                    primary={
                                        settings.secondaryColor || {
                                            main: "#f5bd1f",
                                            dark: "rgba(245,189,31,0.5)",
                                        }
                                    }
                                >
                                    <DateTimePicker
                                        label="Expiration"
                                        onChange={(value) => {
                                            setMuteUser({
                                                ...muteUser,
                                                exp: value?.toDate() || undefined,
                                            });
                                        }}
                                    />
                                </Theme>
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                )}
                btns={() => [
                    {
                        text: "Cancel",
                        action: (_state, _setState, closeDialog) => {
                            closeDialog();
                        },
                    },
                    {
                        text: "Confirm",
                        action: (_state, _setState, closeDialog) => {
                            if (muteUser?.id && muteUser?.reason) {
                                api.userMute(muteUser?.id, {
                                    reason: muteUser.reason,
                                    exp: muteUser.exp,
                                })
                                    .then(() => {
                                        closeDialog();
                                        setNotification({
                                            open: true,
                                            severity: "success",
                                            text: "User muted.",
                                        });
                                        search();
                                    })
                                    .catch((err) => {
                                        setNotification({
                                            open: true,
                                            severity: "error",
                                            text: parseError(err),
                                        });
                                    });
                            }
                        },
                        disabled: !(muteUser?.id && muteUser?.reason),
                    },
                ]}
            />
            <AlertDialog
                open={banDialogOpen}
                setOpen={setBanDialogOpen}
                title={`Ban user ${
                    users?.find((user) => user.id === banUser?.id)?.name
                } (#${banUser?.id})?`}
                body={(state, setState, closeDialog) => (
                    <Grid container spacing={2} sx={{ my: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                label="Reason"
                                color="secondary"
                                required
                                onChange={(e) => {
                                    setBanUser({ ...banUser, reason: e.target.value });
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Theme
                                    mode={darkMode ? "dark" : "light"}
                                    primary={
                                        settings.secondaryColor || {
                                            main: "#f5bd1f",
                                            dark: "rgba(245,189,31,0.5)",
                                        }
                                    }
                                >
                                    <DateTimePicker
                                        label="Expiration"
                                        onChange={(value) => {
                                            setBanUser({
                                                ...banUser,
                                                exp: value?.toDate() || undefined,
                                            });
                                        }}
                                    />
                                </Theme>
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                )}
                btns={() => [
                    {
                        text: "Cancel",
                        action: (_state, _setState, closeDialog) => {
                            closeDialog();
                        },
                    },
                    {
                        text: "Confirm",
                        action: (_state, _setState, closeDialog) => {
                            if (banUser?.id && banUser?.reason) {
                                api.userBan(banUser?.id, {
                                    reason: banUser.reason,
                                    exp: banUser.exp,
                                })
                                    .then(() => {
                                        closeDialog();
                                        setNotification({
                                            open: true,
                                            severity: "success",
                                            text: "User banned.",
                                        });
                                        search();
                                    })
                                    .catch((err) => {
                                        setNotification({
                                            open: true,
                                            severity: "error",
                                            text: parseError(err),
                                        });
                                    });
                            }
                        },
                        disabled: !(banUser?.id && banUser?.reason),
                    },
                ]}
            />
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField
                        color="secondary"
                        label="User ID"
                        onChange={(e) => {
                            setSearchSettings({
                                ...searchSettings,
                                id: e.target.value ? Number(e.target.value) : undefined,
                            });
                        }}
                        type="number"
                        inputProps={{ min: 1 }}
                        fullWidth
                        value={searchSettings?.id || ""}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        color="secondary"
                        label="User Name"
                        onChange={(e) => {
                            setSearchSettings({
                                ...searchSettings,
                                name: e.target.value || undefined,
                            });
                        }}
                        inputProps={{ maxLength: 15 }}
                        fullWidth
                        value={searchSettings?.name || ""}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        color="secondary"
                        label="User Email"
                        onChange={(e) => {
                            setSearchSettings({
                                ...searchSettings,
                                email: e.target.value || undefined,
                            });
                        }}
                        type="email"
                        fullWidth
                        value={searchSettings?.email || ""}
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormControl sx={{ minWidth: 120 }} fullWidth>
                        <InputLabel color="secondary">User Gender</InputLabel>
                        <Select
                            color="secondary"
                            label="User Gender"
                            variant="outlined"
                            defaultValue=""
                            onChange={(e) => {
                                setSearchSettings({
                                    ...searchSettings,
                                    sex: (e.target.value as Sex) || undefined,
                                });
                            }}
                            value={searchSettings?.sex || ""}
                        >
                            <MenuItem value=""></MenuItem>
                            <MenuItem value="M">Male</MenuItem>
                            <MenuItem value="F">Female</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={6}>
                    <FormControl sx={{ minWidth: 120 }} fullWidth>
                        <InputLabel color="secondary">User Role</InputLabel>
                        <Select
                            color="secondary"
                            label="User Role"
                            variant="outlined"
                            defaultValue=""
                            onChange={(e) => {
                                setSearchSettings({
                                    ...searchSettings,
                                    role: (e.target.value as Role) || undefined,
                                });
                            }}
                            value={searchSettings?.role || ""}
                        >
                            <MenuItem value=""></MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="user">User</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                onChange={(e) => {
                                    setSearchSettings({
                                        ...searchSettings,
                                        muted: e.target.checked,
                                    });
                                }}
                                color="secondary"
                                checked={!!searchSettings?.muted}
                            />
                        }
                        label="Muted"
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                onChange={(e) => {
                                    setSearchSettings({
                                        ...searchSettings,
                                        banned: e.target.checked,
                                    });
                                }}
                                color="secondary"
                                checked={!!searchSettings?.banned}
                            />
                        }
                        label="Banned"
                    />
                </Grid>
            </Grid>
            <LoadingButton
                color="secondary"
                startIcon={<Search />}
                type="submit"
                loading={loading}
                loadingPosition="start"
                disabled={!formRef.current?.checkValidity?.() || loading}
                variant="contained"
                className="!mt-2"
            >
                Search
            </LoadingButton>
            {!!users && (
                <React.Fragment>
                    <Grid ref={resultsRef} container spacing={2} sx={{ mt: 1 }}>
                        {users.map((userInfo) => (
                            <Grid item xs={isSmallScreen ? 6 : 4}>
                                <Card variant="outlined">
                                    <CardActionArea
                                        href={`/profile/${userInfo.id}`}
                                        target="_blank"
                                    >
                                        <CardContent>
                                            <Typography
                                                gutterBottom
                                                variant="h5"
                                                component="div"
                                                color={
                                                    userInfo.sex === "M"
                                                        ? "#34aadc"
                                                        : "red"
                                                }
                                            >
                                                {userInfo.name}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                <strong>ID:</strong> {userInfo.id}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                <strong>Created At:</strong>{" "}
                                                {new Date(
                                                    userInfo.createdAt
                                                ).toDateString()}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                <strong>Gender:</strong> {userInfo.sex}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                <strong>Role:</strong> {userInfo.role}
                                            </Typography>
                                            {userInfo.mute && (
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    <strong>Muted for:</strong>{" "}
                                                    {userInfo.mute.reason}{" "}
                                                    {userInfo.mute.exp &&
                                                        `(expires: ${new Date(
                                                            userInfo.mute.exp
                                                        ).toDateString()})`}
                                                </Typography>
                                            )}
                                            {userInfo.ban && (
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    <strong>Banned for:</strong>{" "}
                                                    {userInfo.ban.reason}{" "}
                                                    {userInfo.ban.exp &&
                                                        `(expires: ${new Date(
                                                            userInfo.ban.exp
                                                        ).toDateString()})`}
                                                </Typography>
                                            )}
                                        </CardContent>
                                    </CardActionArea>
                                    <CardActions>
                                        <Button
                                            size="small"
                                            color={userInfo.mute ? "success" : "warning"}
                                            onClick={() => {
                                                if (!userInfo.mute) {
                                                    setMuteDialogOpen(true);
                                                    setMuteUser({ id: userInfo.id });
                                                } else {
                                                    api.userUnmute(userInfo.id)
                                                        .then(() => {
                                                            setNotification({
                                                                open: true,
                                                                severity: "success",
                                                                text: "User unmuted.",
                                                            });
                                                            search();
                                                        })
                                                        .catch((err) => {
                                                            setNotification({
                                                                open: true,
                                                                severity: "error",
                                                                text: parseError(err),
                                                            });
                                                        });
                                                }
                                            }}
                                        >
                                            {userInfo.mute ? "Unmute" : "Mute"}
                                        </Button>
                                        <Button
                                            size="small"
                                            color={userInfo.ban ? "success" : "error"}
                                            onClick={() => {
                                                if (!userInfo.ban) {
                                                    setBanDialogOpen(true);
                                                    setBanUser({ id: userInfo.id });
                                                } else {
                                                    api.userUnban(userInfo.id)
                                                        .then(() => {
                                                            setNotification({
                                                                open: true,
                                                                severity: "success",
                                                                text: "User unbanned.",
                                                            });
                                                            search();
                                                        })
                                                        .catch((err) => {
                                                            setNotification({
                                                                open: true,
                                                                severity: "error",
                                                                text: parseError(err),
                                                            });
                                                        });
                                                }
                                            }}
                                        >
                                            {userInfo.ban ? "Unban" : "Ban"}
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Box className="w-full flex justify-center mt-1">
                        <Pagination
                            count={Math.ceil(count / 15)}
                            color="secondary"
                            page={page}
                            onChange={(_e, page) => {
                                setPage(page);
                                setReload(!reload);
                            }}
                        />
                    </Box>
                </React.Fragment>
            )}
        </Box>
    );
});
export default SearchUsers;
