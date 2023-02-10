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

import "./css/App.css";
import "@fontsource/roboto";
import Theme from "./theme";
import { BrowserRouter as Router } from "react-router-dom";
import MenuProvider, { useMenu } from "./components/MenuProvider";
import { Box, CssBaseline } from "@mui/material";
import AppContextProvider, {
    useSettings,
    useSettingsOpen,
    useIsSmallScreen,
    useAlertDialog,
    useDarkMode,
} from "./components/AppContextProvider";
import { Notification as SnackBar } from "./lib/notification";
import Routes from "./Routes";
import loadable from "@loadable/component";
import AlertDialog from "./lib/alertDialog";
import ErrorBoundary from "./ErrorBoundary";
import { useCheckSession } from "./hooks/app/useCheckSession";
import { useRegisterServiceWorker } from "./hooks/app/useRegisterServiceWorker";
import { useSubscribeNotifications } from "./hooks/app/useSubscribeNotifications";
import SidePanel from "./components/sidePanel";

const Menu = loadable(() => import("./components/menu"));
const Settings = loadable(() => import("./components/settings"));

function App() {
    const [menu] = useMenu();
    const isSmallScreen = useIsSmallScreen();
    const [settingsOpen, setSettingsOpen] = useSettingsOpen();
    const [settings] = useSettings();
    const darkMode = useDarkMode();
    const [alertDialog] = useAlertDialog();

    // useEffect hooks
    useCheckSession();
    useRegisterServiceWorker();
    useSubscribeNotifications();

    return (
        <Theme
            mode={darkMode ? "dark" : "light"}
            primary={{
                main: darkMode ? "#222" : "#fff",
                dark: darkMode ? "#171717" : "#f6f6f6",
            }}
            secondary={settings.secondaryColor || { main: "#f5bd1f", dark: "#ffc100" }}
        >
            <CssBaseline />
            <AlertDialog {...alertDialog} />
            <SnackBar />
            <Settings open={settingsOpen} setOpen={setSettingsOpen} />
            <Box
                className={`max-h-screen h-screen ${darkMode ? "dark" : ""}`}
                sx={{ bgcolor: "primary.dark" }}
            >
                <ErrorBoundary>
                    <Router>
                        <Box className="flex">
                            {!isSmallScreen && <SidePanel />}
                            <Box
                                className={
                                    (!menu && "hidden") ||
                                    (isSmallScreen ? "w-100v" : "w-30v")
                                }
                            >
                                <Menu />
                            </Box>
                            <Routes />
                        </Box>
                    </Router>
                </ErrorBoundary>
            </Box>
        </Theme>
    );
}

export default function MetahkgWebApp(props: { reCaptchaSiteKey?: string }) {
    const { reCaptchaSiteKey } = props;
    return (
        <ErrorBoundary>
            <AppContextProvider reCaptchaSiteKey={reCaptchaSiteKey}>
                <MenuProvider>
                    <ErrorBoundary>
                        <App />
                    </ErrorBoundary>
                </MenuProvider>
            </AppContextProvider>
        </ErrorBoundary>
    );
}
