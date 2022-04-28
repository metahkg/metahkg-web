import React, { useEffect } from "react";
import "./css/common.css";
import "./css/App.css";
import Theme from "./lib/theme";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import Register from "./pages/users/signup";
import Signin from "./pages/users/signin";
import Thread from "./pages/thread";
import AddComment from "./pages/AddComment";
import Create from "./pages/create";
import Category from "./pages/category";
import Logout from "./pages/users/logout";
import Search from "./pages/search";
import Profile from "./pages/profile";
import History from "./pages/history";
import Menu from "./components/menu";
import { useMenu } from "./components/MenuProvider";
import { Box } from "@mui/material";
import {
    useSettings,
    useSettingsOpen,
    useUser,
    useIsSmallScreen,
} from "./components/ContextProvider";
import { Notification } from "./lib/notification";
import NotFound from "./pages/notfound";
import Verify from "./pages/users/verify";
import Resend from "./pages/users/resend";
import Recall from "./pages/recall";
import Settings from "./components/settings";
import Forbidden from "./pages/forbidden";
import { api } from "./lib/api";

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
        if (user) {
            api.get("/users/loggedin").then((res) => {
                if (!res.data.loggedin) return localStorage.removeItem("token");

                localStorage.token !== res.data.token &&
                    localStorage.setItem("token", res.data.token);
            });
        }
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
                        <Routes>
                            <Route
                                path="/"
                                element={<Navigate to="/category/1" replace />}
                            />
                            <Route path="/thread/:id" element={<Thread />} />
                            <Route path="/comment/:id" element={<AddComment />} />
                            <Route path="/category/:category" element={<Category />} />
                            <Route path="/users/register" element={<Register />} />
                            <Route path="/users/verify" element={<Verify />} />
                            <Route path="/users/resend" element={<Resend />} />
                            <Route path="/users/signin" element={<Signin />} />
                            <Route path="/users/logout" element={<Logout />} />
                            <Route path="/create" element={<Create />} />
                            <Route path="/search" element={<Search />} />
                            <Route path="/profile/:id" element={<Profile />} />
                            <Route path="/history/:id" element={<History />} />
                            <Route path="/recall" element={<Recall />} />
                            <Route path="/404" element={<NotFound />} />
                            <Route path="/401" element={<Forbidden />} />
                            <Route path="*" element={<Navigate to="/404" replace />} />
                        </Routes>
                    </div>
                </Router>
            </Box>
        </Theme>
    );
}
