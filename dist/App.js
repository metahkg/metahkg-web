import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import "./css/common.css";
import "./css/App.css";
import Theme from "./lib/theme";
import { BrowserRouter as Router } from "react-router-dom";
import { useMenu } from "./components/MenuProvider";
import { Box } from "@mui/material";
import { useSettings, useSettingsOpen, useUser, useIsSmallScreen, } from "./components/ContextProvider";
import { Notification } from "./lib/notification";
import { api } from "./lib/api";
import Routes from "./Routes";
import loadable from "@loadable/component";
const Menu = loadable(() => import("./components/menu"));
const Settings = loadable(() => import("./components/settings"));
/**
 * Menu is not in the Routes to prevent unnecessary rerenders
 * Instead it is controlled by components inside Routes
 */
export default function App() {
    const [menu] = useMenu();
    const isSmallScreen = useIsSmallScreen();
    const [settingsOpen, setSettingsOpen] = useSettingsOpen();
    const [settings] = useSettings();
    const [user] = useUser();
    useEffect(() => {
        if (user)
            api.users.status().then((res) => {
                const { active } = res.data;
                if (!active)
                    localStorage.removeItem("token");
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (_jsxs(Theme, Object.assign({ primary: { main: "#222" }, secondary: settings.secondaryColor || { main: "#f5bd1f", dark: "#ffc100" } }, { children: [_jsx(Notification, {}), _jsx(Settings, { open: settingsOpen, setOpen: setSettingsOpen }), _jsx(Box, Object.assign({ className: "max-height-fullvh", sx: { bgcolor: "primary.dark" } }, { children: _jsx(Router, { children: _jsxs("div", Object.assign({ className: "flex" }, { children: [_jsx("div", Object.assign({ style: {
                                    width: !menu ? 0 : isSmallScreen ? "100vw" : "30vw",
                                } }, { children: _jsx(Menu, {}) })), _jsx(Routes, {})] })) }) }))] })));
}
//# sourceMappingURL=App.js.map