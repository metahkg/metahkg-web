import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import "../css/pages/profile.css";
import { Box, Button, Tooltip } from "@mui/material";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
    useReFetch,
    useMenu,
    useProfile,
    useSelected,
    useMenuTitle,
    useMenuMode,
} from "../components/MenuProvider";
import UploadAvatar from "../components/profile/uploadavatar";
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
import { parseError } from "../lib/parseError";
import Loader from "../lib/loader";

/**
 * This function renders the profile page
 */
export default function Profile() {
    const params = useParams();
    const [profile, setProfile] = useProfile();
    const [requestedUser, setRequestedUser] = useState<UserData | null>(null);
    const [menu, setMenu] = useMenu();
    const [menuMode, setMenuMode] = useMenuMode();
    const isSmallScreen = useIsSmallScreen();
    const [, setReFetch] = useReFetch();
    const [, setMenuTitle] = useMenuTitle();
    const [selected, setSelected] = useSelected();
    const [back, setBack] = useBack();
    const [, setNotification] = useNotification();
    const [user] = useUser();
    const avatarRef = useRef<HTMLImageElement>(null);
    const navigate = useNavigate();

    const userId = Number(params.id);
    const isSelf = userId === user?.id;

    useEffect(() => {
        if (isInteger(userId) && (!requestedUser || requestedUser.id !== userId)) {
            api.usersProfile(userId)
                .then((data) => {
                    setRequestedUser(data);
                    setTitle(`${data.name} | Metahkg`);
                })
                .catch((err) => {
                    setNotification({ open: true, text: parseError(err) });
                    err?.response?.status === 404 && navigate("/404", { replace: true });
                    err?.response?.status === 403 && navigate("/403", { replace: true });
                });
        }
    }, [navigate, params.id, requestedUser, setNotification, userId]);

    useLayoutEffect(() => {
        /**
         * Clear the data and reset the title and selected index.
         */
        function clearData() {
            setReFetch(true);
            setMenuTitle("");
            selected && setSelected(0);
        }

        back !== window.location.pathname && setBack(window.location.pathname);

        !menu && !isSmallScreen && setMenu(true);
        menu && isSmallScreen && setMenu(false);

        if (profile !== userId || menuMode !== "profile") clearData();

        if (menuMode !== "profile") setMenuMode("profile");
        if (profile !== userId) setProfile(userId);
    }, [
        back,
        isSmallScreen,
        menu,
        menuMode,
        profile,
        selected,
        setBack,
        setMenu,
        setMenuMode,
        setMenuTitle,
        setProfile,
        setReFetch,
        setSelected,
        userId,
    ]);

    if (!userId) return <Navigate to="/" replace />;

    return (
        <Box
            className="max-height-fullvh height-fullvh overflow-auto"
            sx={{
                backgroundColor: "primary.dark",
                width: isSmallScreen ? "100vw" : "70vw",
            }}
        >
            {!requestedUser ? (
                <Loader position="center" />
            ) : (
                <Box className="flex justify-center align-center flex-dir-column">
                    <Box
                        className="flex justify-center align-center max-width-full mt20"
                        sx={{
                            width: isSmallScreen ? "100vw" : "70vw",
                        }}
                    >
                        <img
                            src={`/api/users/${requestedUser.id}/avatar`}
                            alt="User avatar"
                            height={isSmallScreen ? 150 : 200}
                            width={isSmallScreen ? 150 : 200}
                            ref={avatarRef}
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
                                        className="overflow-hidden text-overflow-ellipsis nowrap inline-block max-width-full"
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
                                            onSuccess={() => {
                                                if (avatarRef.current)
                                                    avatarRef.current.src = `/api/users/${
                                                        requestedUser.id
                                                    }/avatar?rand=${Math.random()}`;
                                            }}
                                            onError={(err) => {
                                                setNotification({
                                                    open: true,
                                                    text: parseError(err),
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
                            key={requestedUser.id}
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
