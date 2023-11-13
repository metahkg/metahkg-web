/*
 Copyright (C) 2022-present Metahkg Contributors

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

import { Slider, Stack } from "@mui/material";
import React, { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { api } from "../../lib/api";
import { parseError } from "../../lib/parseError";
import { PopUp } from "../../lib/popup";
import { useNotification, useUser } from "../AppContextProvider";

export default function AvatarEditorPopUp(props: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    avatar: File | null;
    setAvatar: React.Dispatch<React.SetStateAction<File | null>>;
    avatarOriginal: File;
    onSuccess: () => void;
}) {
    const { open, setOpen, avatar, setAvatar, avatarOriginal, onSuccess } = props;
    const [avatarProps, setAvatarProps] = useState({
        scale: 1,
        rotate: 0,
    });
    const [, setNotification] = useNotification();
    const [user] = useUser();
    const editorRef = useRef<AvatarEditor>(null);

    const resetAvatarProps = () => {
        setAvatarProps({
            scale: 1,
            rotate: 0,
        });
    };

    return (
        <PopUp
            open={open}
            setOpen={setOpen}
            title={"Edit avatar"}
            buttons={[
                {
                    text: "Cancel",
                    action: () => {
                        setOpen(false);
                        resetAvatarProps();
                    },
                },
                {
                    text: "Confirm",
                    action: () => {
                        if (avatar && user) {
                            setNotification({
                                open: true,
                                severity: "info",
                                text: "Uploading avatar...",
                            });
                            api.userAvatarUpload(user?.id, {
                                data: avatar,
                                fileName: "avatar",
                            })
                                .then(() => {
                                    setNotification({
                                        open: true,
                                        severity: "success",
                                        text: "Avatar updated.",
                                    });
                                    onSuccess();
                                    setOpen(false);
                                    resetAvatarProps();
                                })
                                .catch((err) => {
                                    setNotification({
                                        open: true,
                                        severity: "error",
                                        text: parseError(err),
                                    });
                                    setOpen(false);
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
                image={avatarOriginal}
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
                                setAvatar(
                                    new File([blob], "avatar.png", {
                                        type: "image/png",
                                    }),
                                );
                            });
                    }
                }}
            />
            <Stack spacing={2} direction="row" sx={{ mx: 2 }} alignItems="center">
                <p>Zoom</p>
                <Slider
                    min={1}
                    max={5}
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
                <p>{avatarProps.scale}x</p>
            </Stack>
            <Stack spacing={2} direction="row" sx={{ mx: 2 }} alignItems="center">
                <p>Rotate</p>
                <Slider
                    min={0}
                    max={360}
                    step={1}
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
                <p>{avatarProps.rotate}°</p>
            </Stack>
        </PopUp>
    );
}
