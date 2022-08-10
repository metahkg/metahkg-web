import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { Box, Button, Slider, Stack, Tooltip } from "@mui/material";
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
import { parseError } from "../lib/parseError";
import Loader from "../lib/loader";
import { PopUp } from "../lib/popup";
import AvatarEditor from "react-avatar-editor";

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
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarFileOriginal, setAvatarFileOriginal] = useState<File | null>(null);
    const [editorOpen, setEditorOpen] = useState(false);
    const [avatarProps, setAvatarProps] = useState({
        scale: 1,
        rotate: 0,
    });

    const resetAvatarProps = () => {
        setAvatarProps({
            scale: 1,
            rotate: 0,
        });
    };

    const avatarRef = useRef<HTMLImageElement>(null);
    const editorRef = useRef<AvatarEditor>(null);
    const navigate = useNavigate();

    const userId = Number(params.id);
    const isSelf = userId === user?.id;

    useEffect(() => {
        if (Number.isInteger(userId) && (!requestedUser || requestedUser.id !== userId)) {
            api.userProfile(userId)
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
            className={`max-h-screen h-screen overflow-auto ${
                isSmallScreen ? "w-100v" : "w-70v"
            }`}
            sx={{
                backgroundColor: "primary.dark",
            }}
        >
            {!requestedUser ? (
                <Loader position="center" />
            ) : (
                <Box className="flex justify-center items-center flex-col">
                    {avatarFileOriginal && (
                        <PopUp
                            open={editorOpen}
                            setOpen={setEditorOpen}
                            title={"Edit avatar"}
                            buttons={[
                                {
                                    text: "Cancel",
                                    action: () => {
                                        setEditorOpen(false);
                                        resetAvatarProps();
                                    },
                                },
                                {
                                    text: "Confirm",
                                    action: () => {
                                        if (avatarFile) {
                                            setNotification({
                                                open: true,
                                                text: "Uploading avatar...",
                                            });
                                            api.meAvatar({
                                                data: avatarFile,
                                                fileName: "avatar",
                                            })
                                                .then(() => {
                                                    setNotification({
                                                        open: true,
                                                        text: "Avatar updated.",
                                                    });
                                                    if (avatarRef.current)
                                                        avatarRef.current.src = `/api/user/${
                                                            requestedUser.id
                                                        }/avatar?rand=${Math.random()}`;
                                                    setEditorOpen(false);
                                                    resetAvatarProps();
                                                })
                                                .catch((err) => {
                                                    setNotification({
                                                        open: true,
                                                        text: parseError(err),
                                                    });
                                                    setEditorOpen(false);
                                                    resetAvatarProps();
                                                });
                                        }
                                    },
                                },
                            ]}
                            onClose={resetAvatarProps}
                        >
                            <AvatarEditor
                                ref={editorRef}
                                image={avatarFileOriginal}
                                width={200}
                                height={200}
                                border={50}
                                borderRadius={100}
                                color={[33, 33, 33, 0.6]} // RGBA
                                scale={avatarProps.scale}
                                rotate={avatarProps.rotate}
                                onImageChange={() => {
                                    const canvas = editorRef.current?.getImage();
                                    if (canvas) {
                                        const dataUrl = canvas.toDataURL();
                                        fetch(dataUrl)
                                            .then((res) => res.blob())
                                            .then(async (blob) => {
                                                setAvatarFile(
                                                    new File([blob], "avatar.png", {
                                                        type: "image/png",
                                                    })
                                                );
                                            });
                                    }
                                }}
                            />
                            <Stack
                                spacing={2}
                                direction="row"
                                sx={{ mx: 2 }}
                                alignItems="center"
                            >
                                <p>Zoom</p>
                                <Slider
                                    min={1}
                                    max={3}
                                    step={0.05}
                                    value={avatarProps.scale}
                                    color="secondary"
                                    sx={{
                                        "& span": {
                                            color: "unset",
                                        },
                                    }}
                                    onChange={(_e, value) => {
                                        if (typeof value === "number")
                                            setAvatarProps({
                                                ...avatarProps,
                                                scale: value,
                                            });
                                    }}
                                />
                            </Stack>
                            <Stack
                                spacing={2}
                                direction="row"
                                sx={{ mx: 2 }}
                                alignItems="center"
                            >
                                <p>Rotate</p>
                                <Slider
                                    min={0}
                                    max={360}
                                    step={3}
                                    value={avatarProps.rotate}
                                    color="secondary"
                                    sx={{
                                        "& span": {
                                            color: "unset",
                                        },
                                    }}
                                    onChange={(_e, value) => {
                                        if (typeof value === "number")
                                            setAvatarProps({
                                                ...avatarProps,
                                                rotate: value,
                                            });
                                    }}
                                />
                            </Stack>
                        </PopUp>
                    )}
                    <Box
                        className={`flex justify-center items-center max-w-full !mt-[20px] ${
                            isSmallScreen ? "w-100v" : "w-70v"
                        }`}
                    >
                        <img
                            src={`/api/user/${requestedUser.id}/avatar`}
                            alt="User avatar"
                            height={isSmallScreen ? 150 : 200}
                            width={isSmallScreen ? 150 : 200}
                            ref={avatarRef}
                        />
                        <br />
                        <Box
                            className={`!ml-[20px] flex justify-center h-[200px] ${
                                isSelf ? "flex-col" : ""
                            }`}
                        >
                            <h1 className="text-[30px] self-center whitespace-nowrap leading-[37px] max-h-[37px]">
                                <Box
                                    className={`overflow-hidden ${
                                        isSmallScreen
                                            ? "max-w-[calc(100vw-250px)]"
                                            : "max-w-[calc(70vw-350px)]"
                                    }`}
                                >
                                    <span
                                        className={`overflow-hidden text-ellipsis whitespace-nowrap inline-block max-w-full ${
                                            requestedUser.sex === "M"
                                                ? "text-[#34aadc]"
                                                : "text-[red]"
                                        }`}
                                    >
                                        {requestedUser.name}
                                    </span>
                                </Box>
                                #{requestedUser.id}
                            </h1>
                            <Box className={isSelf ? "mt-[25px]" : ""}>
                                {isSelf && (
                                    <Tooltip title="jpg / png / svg supported" arrow>
                                        <UploadAvatar
                                            onChange={(image) => {
                                                setAvatarFileOriginal(image);
                                                setEditorOpen(true);
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
