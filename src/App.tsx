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
import { Notification as SnackBar } from "./lib/notification";
import { api } from "./lib/api";
import { ErrorDto } from "@metahkg/api";
import Routes from "./Routes";
import loadable from "@loadable/component";
import AlertDialog from "./lib/alertDialog";
import { register, unregister } from "./serviceWorkerRegistration";
import { parseError } from "./lib/parseError";
import { checkNotificationPromise } from "./lib/checkNotificationPromise";

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
                onSuccess: async (_registration) => {
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

    useEffect(() => {
        // some browsers (like ios safari does not support Notification)
        // some code from https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API
        if (!("Notification" in window)) {
            return console.log("This browser does not support notifications.");
        }
        if (user) {
            console.log("request notification permission");
            function handlePermission(status: NotificationPermission) {
                console.log("notification permission", status);
                if ("serviceWorker" in navigator) {
                    navigator.serviceWorker.ready.then(async (registration) => {
                        if (await registration.pushManager.getSubscription()) return;
                        console.log("subscribe");
                        const subscription = await registration.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY,
                        });
                        const auth = subscription.toJSON().keys?.auth;
                        const p256dh = subscription.toJSON().keys?.p256dh;

                        if (auth && p256dh) {
                            await api.meNotificationsSubscribe({
                                endpoint: subscription.endpoint,
                                keys: {
                                    auth,
                                    p256dh,
                                },
                            });
                        }
                    });
                }
            }
            // check notification promise for compatibility
            if (checkNotificationPromise()) {
                Notification.requestPermission()
                    .then(handlePermission)
                    .catch(console.log);
            } else {
                Notification.requestPermission(handlePermission);
            }
        }
    }, [user]);

    return (
        <Theme
            primary={{ main: "#222" }}
            secondary={settings.secondaryColor || { main: "#f5bd1f", dark: "#ffc100" }}
        >
            <AlertDialog {...alertDialog} />
            <SnackBar />
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
