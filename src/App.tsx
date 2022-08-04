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
    const [alertDialog] = useAlertDialog();
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
                onUpdate: async (registration) => {
                    registration.waiting?.postMessage("skipWaiting");
                    window.location.reload();
                },
                onSuccess: async (registration) => {
                    console.log("service worker registered");
                },
            });

            if ("serviceWorker" in navigator) {
                navigator.serviceWorker.ready
                    .then(async (registration) => {
                        console.log("updating service worker");

                        await registration.update();

                        registration.addEventListener("updatefound", () => {
                            console.log("update found");
                            console.log("service worker skip waiting");
                            registration.waiting?.postMessage("skipWaiting");
                            window.location.reload();
                        });

                        setInterval(registration.update, 1000 * 60 * 10);
                    })
                    .catch((error) => {
                        console.error(error.message);
                    });
            }
        } catch {
            console.error("Service worker registration failed");
        }
    }, []);

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
