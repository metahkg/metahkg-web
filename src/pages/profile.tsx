/*
 Copyright (C) 2022-present Wong Chun Yat (wcyat)

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React, { useEffect, useState, useLayoutEffect, useMemo } from "react";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
    useUserAvatar,
    useServerConfig,
} from "../components/AppContextProvider";
import { api } from "../lib/api";
import DataTable, { UserData } from "../components/profile/DataTable";
import { parseError } from "../lib/parseError";
import Loader from "../lib/loader";
import AvatarEditorPopUp from "../components/profile/avatarEditorPopUp";
import UserAvatar from "../components/UserAvatar";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { memo } from "react";
const Profile = memo(function Profile() {
    const { t } = useTranslation();
    const params = useParams();
    const [profile, setProfile] = useProfile();
    const [reqUser, setReqUser] = useState<UserData | null>(null);
    const [menu, setMenu] = useMenu();
    const [menuMode, setMenuMode] = useMenuMode();
    const isSmallScreen = useIsSmallScreen();
    const [, setReFetch] = useReFetch();
    const [, setMenuTitle] = useMenuTitle();
    const [selected, setSelected] = useSelected();
    const [back, setBack] = useBack();
    const [, setNotification] = useNotification();
    const [user] = useUser();
    const [uploadedAvatar, setUploadedAvatar] = useState<File | null>(null);
    const [uploadedAvatarOriginal, setUploadedAvatarOriginal] = useState<File | null>(
        null
    );
    const [editorOpen, setEditorOpen] = useState(false);
    const [serverConfig] = useServerConfig();

    const navigate = useNavigate();

    const userId = useMemo(() => Number(params.id), [params.id]);
    const isSelf = useMemo(() => userId === user?.id, [user?.id, userId]);

    const userAvatar = useUserAvatar();

    useEffect(() => {
        if (Number.isInteger(userId) && (!reqUser || reqUser.id !== userId)) {
            api.userProfile(userId)
                .then((data) => {
                    setReqUser(data);
                    setTitle(`${data.name} | ${t("common.branding")}`);
                })
                .catch((err) => {
                    setNotification({
                        open: true,
                        severity: "error",
                        text: parseError(err),
                    });
                    err?.response?.status === 404 && navigate("/404", { replace: true });
                    err?.response?.status === 403 && navigate("/403", { replace: true });
                });
        }
    }, [navigate, params.id, reqUser, serverConfig?.branding, setNotification, userId, t]);

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
    }, [back, isSmallScreen, menu, menuMode, profile, selected, setBack, setMenu, setMenuMode, setMenuTitle, setProfile, setReFetch, setSelected, userId]);

    const buttons = useMemo(
        () =>
            isSelf
                ? ([
                      !userAvatar.error && {
                          icon: <DeleteIcon />,
                          label: t("profile.delete_avatar_button"),
                          onClick: () => {
                              if (user) {
                                  setNotification({
                                      open: true,
                                      severity: "info",
                                      text: t("profile.deleting_avatar_notification"),
                                  });
                                  api.userAvatarDelete(user.id)
                                      .then(() => {
                                          setNotification({
                                              open: true,
                                              severity: "success",
                                              text: t(
                                                  "profile.avatar_deleted_notification"
                                              ),
                                          });
                                          userAvatar.reload();
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
                      },
                  ].filter(Boolean) as {
                      icon: React.ReactNode;
                      label?: string;
                      onClick?: () => void;
                  }[])
                : undefined,
        [isSelf, setNotification, user, userAvatar, t] // Added t to dependencies
    );

    const customButtons = useMemo(
        () =>
            isSelf
                ? [
                      <Tooltip title={t("profile.upload_avatar_tooltip")} arrow>
                          <UploadAvatar
                              onChange={(image) => {
                                  setUploadedAvatarOriginal(image);
                                  setUploadedAvatar(image);
                                  setEditorOpen(true);
                              }}
                          />
                      </Tooltip>,
                  ]
                : undefined,
        [isSelf, t]
    );

    if (!userId) return <Navigate to="/" replace />;

    return (
        <Box
            className="max-h-screen h-screen overflow-auto w-full grid"
            sx={{
                backgroundColor: "primary.dark",
            }}
        >
            {!reqUser ? (
                <Loader position="center" />
            ) : (
                <Box className="flex place-self-center justify-center items-center flex-col w-[90%] max-w-[90%] mb-5">
                    {uploadedAvatarOriginal && (
                        <AvatarEditorPopUp
                            open={editorOpen}
                            setOpen={setEditorOpen}
                            avatar={uploadedAvatar}
                            setAvatar={setUploadedAvatar}
                            avatarOriginal={uploadedAvatarOriginal}
                            onSuccess={() => {
                                userAvatar.reload();
                            }}
                        />
                    )}
                    <Box
                        className={
                            "flex justify-center items-center max-w-full mt-3 w-full"
                        }
                    >
                        <UserAvatar
                            user={reqUser}
                            avatar={isSelf ? userAvatar : undefined}
                            sx={{
                                height: 120,
                                width: 120,
                            }}
                            buttons={buttons}
                            customButtons={customButtons}
                        />
                        <Box
                            className={`${
                                isSelf ? "!ml-[40px]" : "!ml-[25px]"
                            } flex justify-center overflow-x-hidden h-[200px] flex-col`}
                        >
                            <Typography
                                variant="h5"
                                component="p"
                                gutterBottom
                                className={`!text-3xl text-left whitespace-nowrap !max-h-9 text-ellipsis overflow-hidden !max-w-full ${
                                    reqUser.sex === "M" ? "text-[#34aadc]" : "text-[red]"
                                }`}
                            >
                                {reqUser.name}
                            </Typography>
                            <Typography
                                variant="h6"
                                component="p"
                                className="!text-2xl text-left"
                            >
                                #{reqUser.id}
                            </Typography>
                        </Box>
                    </Box>
                    <Box className="flex !mb-2 w-full font justify-center">
                        <DataTable
                            isSelf={isSelf}
                            setReqUser={setReqUser}
                            reqUser={reqUser}
                            key={reqUser.id}
                        />
                    </Box>
                    {isSmallScreen && (
                        <Box className="!mt-5">
                            <Link className="!no-underline" to={`/history/${userId}`}>
                                <Button
                                    className="text-base"
                                    variant="text"
                                    color="secondary"
                                >
                                    {t("profile.view_history_button")}
                                </Button>
                            </Link>
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
});
export default Profile;
