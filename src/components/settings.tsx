import React, { useEffect } from "react";
import { Box, Switch } from "@mui/material";
import { PopUp } from "../lib/popup";
import { useSettings } from "./ContextProvider";
import { IOSSwitch } from "../lib/switch";
export default function Settings(props: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { open, setOpen } = props;
  const [settings, setSettings] = useSettings();
  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);
  const settingItems: {
    title: string;
    action: (e: React.ChangeEvent<HTMLInputElement>) => void;
    checked?: boolean;
  }[] = [
    {
      title: "Voting Bar",
      action: (e) => {
        setSettings({ ...settings, votebar: e.target.checked });
      },
      checked: settings.votebar,
    },
  ];
  return (
    <PopUp title="Settings" open={open} setOpen={setOpen}>
      <Box className="fullwidth ml20 mr10" sx={{ bgcolor: "primary.main" }}>
        {settingItems.map((item) => (
          <div className="flex justify-space-between align-center fullwidth mt4 mb4">
            <p className="nomargin">{item.title}</p>
            <IOSSwitch
              color="secondary"
              checked={item.checked}
              onChange={item.action}
            />
          </div>
        ))}
      </Box>
    </PopUp>
  );
}
