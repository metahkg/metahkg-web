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
import { useEffect } from "react";
import { Helmet } from "react-helmet";

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

    useEffect(() => {
        document.querySelector("html")?.classList.add(darkMode ? "dark" : "light");
        document.querySelector("html")?.classList.remove(darkMode ? "light" : "dark");
    }, [darkMode]);

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
            <ErrorBoundary>
                <Box
                    className="max-h-screen h-screen max-w-100v w-screen overflow-hidden"
                    sx={{ bgcolor: "primary.dark" }}
                >
                    <Helmet>
                        {darkMode ? (
                            <link
                                rel="stylesheet"
                                href="https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/themes/prism-tomorrow.min.css"
                                integrity="sha512-kSwGoyIkfz4+hMo5jkJngSByil9jxJPKbweYec/UgS+S1EgE45qm4Gea7Ks2oxQ7qiYyyZRn66A9df2lMtjIsw=="
                                crossOrigin="anonymous"
                                referrerPolicy="no-referrer"
                            />
                        ) : (
                            <link
                                rel="stylesheet"
                                href="https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/themes/prism.min.css"
                                integrity="sha512-/mZ1FHPkg6EKcxo0fKXF51ak6Cr2ocgDi5ytaTBjsQZIH/RNs6GF6+oId/vPe3eJB836T36nXwVh/WBl/cWT4w=="
                                crossOrigin="anonymous"
                                referrerPolicy="no-referrer"
                            />
                        )}
                    </Helmet>
                    <AlertDialog {...alertDialog} />
                    <SnackBar />
                    <Settings open={settingsOpen} setOpen={setSettingsOpen} />
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
                </Box>
            </ErrorBoundary>
        </Theme>
    );
}

export default function MetahkgWebApp(props: {
    reCaptchaSiteKey?: string;
    turnstileSiteKey?: string;
}) {
    const { reCaptchaSiteKey, turnstileSiteKey } = props;
    return (
        <ErrorBoundary>
            <AppContextProvider
                reCaptchaSiteKey={reCaptchaSiteKey}
                turnstileSiteKey={turnstileSiteKey}
            >
                <MenuProvider>
                    <ErrorBoundary>
                        <App />
                    </ErrorBoundary>
                </MenuProvider>
            </AppContextProvider>
        </ErrorBoundary>
    );
}
