import { useEffect } from "react";
import "./css/common.css";
import "./css/App.css";
import Theme from "./lib/theme";
import { BrowserRouter as Router } from "react-router-dom";
import { useMenu } from "./components/MenuProvider";
import { Box } from "@mui/material";
import {
    useSettings,
    useSettingsOpen,
    useUser,
    useIsSmallScreen,
} from "./components/ContextProvider";
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
                if (!active) {
                    localStorage.removeItem("token");
                    window.location.reload();
                }
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Theme
            primary={{ main: "#222" }}
            secondary={settings.secondaryColor || { main: "#f5bd1f", dark: "#ffc100" }}
        >
            <Notification />
            <Settings open={settingsOpen} setOpen={setSettingsOpen} />
            <Box className="max-height-fullvh" sx={{ bgcolor: "primary.dark" }}>
                <Router>
                    <div className="flex">
                        <div
                            style={{
                                width: !menu ? 0 : isSmallScreen ? "100vw" : "30vw",
                            }}
                        >
                            <Menu />
                        </div>
                        <Routes />
                    </div>
                </Router>
            </Box>
        </Theme>
    );
}
