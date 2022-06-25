import React, { useEffect, useState } from "react";
import "./css/profile.css";
import { Box, Button, LinearProgress, Tooltip } from "@mui/material";
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
import { setTitle } from "../lib/common";
import { Link } from "react-router-dom";
import {
    useBack,
    useNotification,
    useUser,
    useIsSmallScreen,
} from "../components/ContextProvider";
import { api } from "../lib/api";
import DataTable, { UserData } from "../components/profile/DataTable";
import isInteger from "is-sn-integer";

/**
 * This function renders the profile page
 */
export default function Profile() {
    const params = useParams();
    const [profile, setProfile] = useProfile();
    const [search, setSearch] = useSearch();
    const [recall, setRecall] = useRecall();
    const [requestedUser, setRequestedUser] = useState<UserData | null>(null);
    const [menu, setMenu] = useMenu();
    const isSmallScreen = useIsSmallScreen();
    const [, setData] = useData();
    const [, setMenuTitle] = useMenuTitle();
    const [id, setId] = useId();
    const [cat, setCat] = useCat();
    const [selected, setSelected] = useSelected();
    const [back, setBack] = useBack();
    const [, setNotification] = useNotification();
    const [user] = useUser();
    const navigate = useNavigate();

    const userId = Number(params.id);
    const isSelf = userId === user?.id;

    useEffect(() => {
        if (isInteger(userId) && (!requestedUser || requestedUser.id !== userId)) {
            api.profile
                .userProfile({ userId })
                .then((res) => {
                    setRequestedUser(res.data);
                    setTitle(`${res.data.name} | Metahkg`);
                })
                .catch((err) => {
                    setNotification({ open: true, text: err?.response?.data?.error });
                    err?.response?.status === 404 && navigate("/404", { replace: true });
                    err?.response?.status === 403 && navigate("/403", { replace: true });
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id, requestedUser]);

    if (!userId) return <Navigate to="/" replace />;

    (function onRender() {
        /**
         * Clear the data and reset the title and selected index.
         */
        function clearData() {
            setData([]);
            setMenuTitle("");
            selected && setSelected(0);
        }

        back !== window.location.pathname && setBack(window.location.pathname);

        !menu && !isSmallScreen && setMenu(true);
        menu && isSmallScreen && setMenu(false);

        if (profile !== userId) {
            setProfile(userId);
            clearData();
        }

        if (search) {
            setSearch(false);
            clearData();
        }

        recall && setRecall(false);
        id && setId(0);
        cat && setCat(0);
    })();

    return (
        <Box
            className="max-height-fullvh height-fullvh overflow-auto"
            sx={{
                backgroundColor: "primary.dark",
            }}
        >
            {!requestedUser ? (
                <LinearProgress className="fullwidth" color="secondary" />
            ) : (
                <Box className="flex justify-center align-center flex-dir-column">
                    <Box
                        className="flex justify-center align-center max-width-full mt20"
                        sx={{
                            width: isSmallScreen ? "100vw" : "70vw",
                        }}
                    >
                        <img
                            src={`/api/profile/avatars/${requestedUser.id}`}
                            alt="User avatar"
                            height={isSmallScreen ? 150 : 200}
                            width={isSmallScreen ? 150 : 200}
                        />
                        <br />
                        <div
                            className="ml20 flex justify-center profile-toptextdiv"
                            style={{
                                flexDirection: isSelf ? "column" : "row",
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
                                                requestedUser.sex === "M"
                                                    ? "#34aadc"
                                                    : "red",
                                        }}
                                    >
                                        {requestedUser.name}
                                    </span>
                                </div>
                                #{requestedUser.id}
                            </h1>
                            <div
                                className="profile-uploaddiv"
                                style={{
                                    marginTop: isSelf ? 25 : 0,
                                }}
                            >
                                {isSelf && (
                                    <Tooltip title="jpg / png / svg supported" arrow>
                                        <UploadAvatar
                                            onUpload={() => {
                                                setNotification({
                                                    open: true,
                                                    text: "Uploading...",
                                                });
                                            }}
                                            onSuccess={window.location.reload}
                                            onError={(err) => {
                                                setNotification({
                                                    open: true,
                                                    text: `Upload failed: ${
                                                        err.response?.data?.error ||
                                                        err.response?.data ||
                                                        "An error occurred"
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
                        <DataTable
                            isSelf={isSelf}
                            setUser={setRequestedUser}
                            requestedUser={requestedUser}
                        />
                    </Box>
                    {isSmallScreen && (
                        <div className="mt20">
                            <Link
                                className="text-decoration-none"
                                to={`/history/${userId}`}
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
            )}
        </Box>
    );
}
