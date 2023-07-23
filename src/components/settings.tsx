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

import React, { ChangeEvent } from "react";
import {
    Box,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography,
} from "@mui/material";
import { PopUp } from "../lib/popup";
import { useSettings, useUser } from "./AppContextProvider";
import { IOSSwitch } from "../lib/switch";
import {
    secondaryColor,
    secondaryColorDark,
    secondaryColorMain,
    Theme,
} from "../types/settings";
import { isIOS, isSafari } from "react-device-detect";
import { unsubscribe } from "../lib/notifications";

export default function Settings(props: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const { open, setOpen } = props;
    const [settings, setSettings] = useSettings();
    const [user] = useUser();

    const colorOptions: {
        value: string;
        main: secondaryColorMain;
        dark: secondaryColorDark;
    }[] = [
        { value: "Yellow", main: "#f5bd1f", dark: "#ffc100" },
        { value: "Orange", main: "#ff9800", dark: "#b26a00" },
        { value: "Teal", main: "#009688", dark: "#00695f" },
        { value: "Purple", main: "#651fff", dark: "#4615b2" },
    ];

    const settingItems: ((
        | {
              type: "checkbox";
              checked?: boolean;
              action: (e: React.ChangeEvent<HTMLInputElement>) => void;
          }
        | {
              type: "select";
              selected?: string;
              options: string[];
              action: (e: SelectChangeEvent<string>) => void;
          }
        | {
              type: "number";
              value?: number;
              pattern?: string;
              helperText?: string;
              action: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
          }
    ) & { title: string; disabled?: boolean })[] = [
        {
            title: "Theme",
            type: "select",
            action: (e) => {
                setSettings({ ...settings, theme: e.target.value as Theme });
            },
            options: ["dark", "light", "system"],
            selected: settings.theme || "dark",
        },
        {
            title: "Accent color",
            type: "select",
            action: (e) => {
                setSettings({
                    ...settings,
                    secondaryColor: (() => {
                        const color = colorOptions.find(
                            (option) => option.value === e.target.value,
                        ) as secondaryColor & { value?: string };
                        delete color.value;
                        return color;
                    })(),
                });
            },
            options: colorOptions.map((option) => option.value),
            selected: colorOptions.find(
                (option) => option.main === settings.secondaryColor?.main,
            )?.value,
        },
        {
            title: "Filter swear words",
            type: "checkbox",
            action: (e) => {
                setSettings({ ...settings, filterSwearWords: e.target.checked });
            },
            checked: isSafari || isIOS ? false : settings.filterSwearWords,
            disabled: isSafari || isIOS,
        },
        {
            title: "Auto load images",
            type: "checkbox",
            action: (e) => {
                setSettings({
                    ...settings,
                    autoLoadImages: e.target.checked,
                });
            },
            checked: settings.autoLoadImages,
        },
        {
            title: "Resize images",
            type: "checkbox",
            action: (e) => {
                setSettings({
                    ...settings,
                    resizeImages: e.target.checked,
                });
            },
            checked: settings.resizeImages,
        },
        {
            title: "Preview links",
            type: "checkbox",
            action: (e) => {
                setSettings({
                    ...settings,
                    linkPreview: e.target.checked,
                });
            },
            checked: settings.linkPreview,
        },
        {
            title: "Notifications",
            type: "checkbox",
            action: (e) => {
                setSettings({
                    ...settings,
                    notifications: e.target.checked,
                });
                // no need to run subscribe since it is handled by useSubscribeNotifications hook
                if (!e.target.checked) {
                    unsubscribe();
                }
            },
            checked: Boolean(user && settings.notifications),
            disabled: !user,
        },
        {
            title: "Pdf viewer from URL (experimental)",
            type: "checkbox",
            action: (e) => {
                setSettings({
                    ...settings,
                    pdfViewer: e.target.checked,
                });
            },
            checked: settings.pdfViewer,
        },
        {
            title: "Video player from URL (experimental)",
            type: "checkbox",
            action: (e) => {
                setSettings({
                    ...settings,
                    videoPlayer: e.target.checked,
                });
            },
            checked: settings.videoPlayer,
        },
        {
            title: "Conversation comments limit per page (1-50)",
            type: "number",
            pattern: "([1-4][0-9]{0,1}|50)",
            value: settings.conversationLimit,
            action: (e) => {
                if (/^([1-4][0-9]{0,1}|50)$/.test(e.target.value)) {
                    setSettings({
                        ...settings,
                        conversationLimit: Number(e.target.value),
                    });
                }
            },
            helperText: "Integers between 1-50 only",
        },
    ];
    return (
        <PopUp title="Settings" open={open} setOpen={setOpen} fullWidth>
            <Box
                className="!mx-5 !my-2 grid grid-cols-1 grid-flow-row gap-y-2"
                sx={{ bgcolor: "primary.main" }}
            >
                {settingItems.map((item, index) => (
                    <Box
                        key={index}
                        className="flex justify-between items-center w-full h-12"
                    >
                        <Typography>{item.title}</Typography>
                        {item.type === "checkbox" && (
                            <IOSSwitch
                                color="secondary"
                                checked={item.checked}
                                onChange={item.action}
                                disabled={item.disabled}
                            />
                        )}
                        {item.type === "select" && (
                            <Select
                                variant="standard"
                                color="secondary"
                                value={item.selected}
                                onChange={item.action}
                                className="max-h-12 min-w-[100px]"
                                disabled={item.disabled}
                            >
                                {item.options.map((option, index) => (
                                    <MenuItem key={index} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}
                        {item.type === "number" && (
                            <TextField
                                variant="standard"
                                color="secondary"
                                value={item.value}
                                type="number"
                                inputProps={{ pattern: item.pattern }}
                                title={item.title}
                                disabled={item.disabled}
                                onChange={item.action}
                                helperText={item.helperText}
                            />
                        )}
                    </Box>
                ))}
            </Box>
        </PopUp>
    );
}
