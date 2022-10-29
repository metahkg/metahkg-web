import { useEffect } from "react";
import "./css/App.css";
import "@fontsource/ibm-plex-sans";
import Theme from "./theme";
import { BrowserRouter as Router } from "react-router-dom";
import MenuProvider, { useMenu } from "./components/MenuProvider";
import { Box } from "@mui/material";
import AppContextProvider, {
    useSettings,
    useSettingsOpen,
    useUser,
    useIsSmallScreen,
    useAlertDialog,
    useSession,
    useNotification,
} from "./components/AppContextProvider";
import { Notification } from "./lib/notification";
import { api } from "./lib/api";
import { ErrorDto } from "@metahkg/api";
import Routes from "./Routes";
import loadable from "@loadable/component";
import AlertDialog from "./lib/alertDialog";
import { register, unregister } from "./serviceWorkerRegistration";
import { parseError } from "./lib/parseError";

const Menu = loadable(() => import("./components/menu"));
const Settings = loadable(() => import("./components/settings"));

function App() {
    const [menu] = useMenu();
    const isSmallScreen = useIsSmallScreen();
    const [settingsOpen, setSettingsOpen] = useSettingsOpen();
    const [settings] = useSettings();
    const [user] = useUser();
    const [alertDialog] = useAlertDialog();
    const [session, setSession] = useSession();
    const [, setNotification] = useNotification();

    useEffect(() => {
        if (user && !session) {
            api.meSession()
                .then(setSession)
                .catch((data: ErrorDto) => {
                    if (data.statusCode === 401) {
                        localStorage.removeItem("token");
                        return window.location.reload();
                    } else {
                        setNotification({
                            open: true,
                            severity: "error",
                            text: parseError(data),
                        });
                    }
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        try {
            if (process.env.REACT_APP_ENV === "dev") return unregister();

            console.log("registering service worker");

            register({
                onUpdate: async (registration) => {
                    registration.waiting?.postMessage({ type: "SKIP_WAITING" });
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
                            registration.waiting?.postMessage({ type: "SKIP_WAITING" });
                            window.location.reload();
                        });

                        setInterval(registration.update, 1000 * 60 * 10);

                        if (registration.waiting) {
                            registration.waiting?.postMessage({ type: "SKIP_WAITING" });
                            window.location.reload();
                        }
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
        </Theme>
    );
}

export default function MetahkgWebApp(props: { reCaptchaSiteKey?: string }) {
    const { reCaptchaSiteKey } = props;
    return (
        <AppContextProvider reCaptchaSiteKey={reCaptchaSiteKey}>
            <MenuProvider>
                <App />
            </MenuProvider>
        </AppContextProvider>
    );
}
