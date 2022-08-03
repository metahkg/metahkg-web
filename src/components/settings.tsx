import React from "react";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { PopUp } from "../lib/popup";
import { useSettings } from "./ContextProvider";
import { IOSSwitch } from "../lib/switch";
import { secondaryColorDark, secondaryColorMain } from "../types/settings";

export default function Settings(props: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const { open, setOpen } = props;
    const [settings, setSettings] = useSettings();

    const settingItems: {
        title: string;
        action: (e: React.ChangeEvent<HTMLInputElement>) => void;
        checked?: boolean;
    }[] = [
        /** votebar is deprecated */
        /*{
            title: "Voting Bar",
            action: (e) => {
                setSettings({ ...settings, votebar: e.target.checked });
            },
            checked: settings.votebar,
        },*/
        {
            title: "Filter swear words",
            action: (e) => {
                setSettings({ ...settings, filterSwearWords: e.target.checked });
            },
            checked: settings.filterSwearWords,
        },
    ];
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
    return (
        <PopUp title="Settings" open={open} setOpen={setOpen} fullWidth>
            <Box className="!ml-[20px] !mr-[10px]" sx={{ bgcolor: "primary.main" }}>
                {settingItems.map((item) => (
                    <Box
                        key={item.title}
                        className="flex justify-between items-center w-full !mt-[4px] !mb-[4px]"
                    >
                        <p className="!m-0">{item.title}</p>
                        <IOSSwitch
                            color="secondary"
                            checked={item.checked}
                            onChange={item.action}
                        />
                    </Box>
                ))}
                <Box className="flex justify-between items-center w-full mt6 !mb-[4px]">
                    <p className="!m-0">Color</p>
                    <ToggleButtonGroup
                        color="secondary"
                        value={
                            colorOptions.find(
                                (item) =>
                                    item.main ===
                                    (settings.secondaryColor?.main || "#f5bd1f")
                            )?.value
                        }
                        exclusive
                        onChange={(e, val) => {
                            const selected = colorOptions.find(
                                (item) => item.value === val
                            ) || {
                                value: "Yellow",
                                main: "#f5bd1f",
                                dark: "#ffc100",
                            };
                            setSettings({
                                ...settings,
                                secondaryColor: {
                                    main: selected.main,
                                    dark: selected.dark,
                                },
                            });
                        }}
                    >
                        {colorOptions.map((item) => (
                            <ToggleButton
                                disableRipple
                                disableTouchRipple
                                disableFocusRipple
                                sx={{ color: `${item.main} !important` }}
                                value={item.value}
                                key={item.value}
                            >
                                {item.value}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Box>
            </Box>
        </PopUp>
    );
}
