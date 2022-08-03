import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
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
            className="max-h-screen h-screen overflow-auto"
            sx={{
                backgroundColor: "primary.dark",
                width: isSmallScreen ? "100vw" : "70vw",
            }}
        >
            {!requestedUser ? (
                <Loader position="center" />
            ) : (
                <Box className="flex justify-center items-center flex-col">
                    <Box
                        className="flex justify-center items-center max-w-full !mt-[20px]"
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
                        <Box
                            className="!ml-[20px] flex justify-center h-[200px]"
                            style={{
                                flexDirection: isSelf ? "column" : "row",
                            }}
                        >
                            <h1 className="text-[30px] self-center whitespace-nowrap leading-[37px] max-h-[37px]">
                                <Box
                                    className="overflow-hidden"
                                    style={{
                                        maxWidth: isSmallScreen
                                            ? "calc(100vw - 250px)"
                                            : "calc(70vw - 350px)",
                                    }}
                                >
                                    <span
                                        className="overflow-hidden text-overflow-ellipsis whitespace-nowrap inline-block max-w-full"
                                        style={{
                                            color:
                                                requestedUser.sex === "M"
                                                    ? "#34aadc"
                                                    : "red",
                                        }}
                                    >
                                        {requestedUser.name}
                                    </span>
                                </Box>
                                #{requestedUser.id}
                            </h1>
                            <Box
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
                            </Box>
                        </Box>
                    </Box>
                    <Box className="flex !mt-[20px] !mb-[10px] w-full font justify-center">
                        <DataTable
                            isSelf={isSelf}
                            setUser={setRequestedUser}
                            requestedUser={requestedUser}
                            key={requestedUser.id}
                        />
                    </Box>
                    {isSmallScreen && (
                        <Box className="!mt-[20px]">
                            <Link className="!no-underline" to={`/history/${userId}`}>
                                <Button
                                    className="text-[16px]"
                                    variant="text"
                                    color="secondary"
                                >
                                    View History
                                </Button>
                            </Link>
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
}
