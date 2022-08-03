import { useEffect } from "react";
import "./css/App.css";
import Theme from "./theme";
import { BrowserRouter as Router } from "react-router-dom";
import { useMenu } from "./components/MenuProvider";
import { Box } from "@mui/material";
import {
    useSettings,
    useSettingsOpen,
    useUser,
    useIsSmallScreen,
    useAlertDialog,
    useBlockList,
} from "./components/ContextProvider";
import { Notification } from "./lib/notification";
import { api } from "./lib/api";
import Routes from "./Routes";
import loadable from "@loadable/component";
import AlertDialog from "./lib/alertDialog";
import { register, unregister } from "./serviceWorkerRegistration";

const Menu = loadable(() => import("./components/menu"));
const Settings = loadable(() => import("./components/settings"));

export default function App() {
    const [menu] = useMenu();
    const isSmallScreen = useIsSmallScreen();
    const [settingsOpen, setSettingsOpen] = useSettingsOpen();
    const [settings] = useSettings();
    const [user] = useUser();
    const [alertDialog, setAlertDialog] = useAlertDialog();
    const [, setBlocked] = useBlockList();

    useEffect(() => {
        if (user) {
            api.meStatus().then((data) => {
                const { active } = data;
                if (!active) {
                    localStorage.removeItem("token");
                    return window.location.reload();
                }
            });
            api.meBlocked().then(setBlocked);
            setInterval(() => {
                api.meBlocked().then(setBlocked);
            }, 1000 * 60 * 10);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        try {
            if (process.env.REACT_APP_ENV === "dev") return unregister();

            console.log("registering service worker");

            register({
                onUpdate: (registration) => {
                    setAlertDialog({
                        ...alertDialog,
                        title: "New version available",
                        message: "Click to update",
                        btns: [
                            {
                                text: "Update",
                                action: () => {
                                    if (registration.waiting) {
                                        registration.waiting.postMessage({
                                            type: "SKIP_WAITING",
                                        });
                                        window.location.reload();
                                    }
                                },
                            },
                            {
                                text: "Cancel",
                                action: () => {
                                    setAlertDialog({
                                        ...alertDialog,
                                        open: false,
                                    });
                                },
                            },
                        ],
                    });
                },
            });
        } catch {
            console.error("Service worker registration failed");
        }
    }, [alertDialog, setAlertDialog]);

    return (
        <Theme
            primary={{ main: "#222" }}
            secondary={settings.secondaryColor || { main: "#f5bd1f", dark: "#ffc100" }}
        >
            <AlertDialog {...alertDialog} />
            <Notification />
            <Settings open={settingsOpen} setOpen={setSettingsOpen} />
            <Box className="max-h-screen h-screen" sx={{ bgcolor: "primary.dark" }}>
                <Router>
                    <Box className="flex">
                        <Box
                            style={{
                                width: !menu ? 0 : isSmallScreen ? "100vw" : "30vw",
                            }}
                        >
                            <Menu />
                        </Box>
                        <Routes />
                    </Box>
                </Router>
            </Box>
        </Theme>
    );
}
