import { Box, Tab, Tabs, Typography } from "@mui/material";
import MetahkgLogo from "../components/logo";
import {
    useDarkMode,
    useIsSmallScreen,
    useServerConfig,
    useUser,
} from "../components/AppContextProvider";
import { useLayoutEffect, useState } from "react";
import { Category, Group, Numbers } from "@mui/icons-material";
import CategoriesBoard from "../components/dashboard/categories/categoriesBoard";
import { useNavigate } from "react-router-dom";
import UsersBoard from "../components/dashboard/users/usersBoard";

export default function Dashboard() {
    const darkMode = useDarkMode();
    const [tab, setTab] = useState<"categories" | "users" | "invitecodes">(
        (localStorage.getItem("admindashboard_tab") as
            | "categories"
            | "users"
            | "invitecodes") || "categories"
    );
    const [serverConfig] = useServerConfig();
    const [user] = useUser();
    const navigate = useNavigate();
    const isSmallScreen = useIsSmallScreen();

    useLayoutEffect(() => {
        if (user?.role !== "admin") {
            navigate("/404");
        }
    }, [navigate, user?.role]);

    return (
        <Box sx={{ backgroundColor: "primary.dark" }} className="flex justify-center">
            <Box
                className={`flex items-center flex-col my-4 ${
                    isSmallScreen ? "w-80v" : "w-60v"
                }`}
            >
                <Box className="flex items-center my-4">
                    <MetahkgLogo
                        svg
                        height={50}
                        width={40}
                        light={darkMode}
                        className="!mr-2 !mb-2"
                    />
                    <Typography variant="h4">Admin Dashboard</Typography>
                </Box>
                <Box className="mt-3">
                    <Box display="flex" justifyContent="center" width="100%">
                        <Tabs
                            value={tab}
                            onChange={(_e, v) => {
                                setTab(v);
                            }}
                            textColor="secondary"
                            indicatorColor="secondary"
                            variant="scrollable"
                            scrollButtons
                            centered
                        >
                            <Tab
                                value={"categories"}
                                label="Categories"
                                icon={<Category />}
                                iconPosition="start"
                                disableRipple
                            />
                            <Tab
                                value={"users"}
                                label="Users"
                                icon={<Group />}
                                iconPosition="start"
                                disableRipple
                            />
                            {serverConfig?.register.mode === "invite" && (
                                <Tab
                                    value={"invitecodes"}
                                    label="Invite codes"
                                    icon={<Numbers />}
                                    iconPosition="start"
                                    disableRipple
                                />
                            )}
                        </Tabs>
                    </Box>
                    {tab === "categories" && <CategoriesBoard />}
                    {tab === "users" && <UsersBoard />}
                </Box>
            </Box>
        </Box>
    );
}
