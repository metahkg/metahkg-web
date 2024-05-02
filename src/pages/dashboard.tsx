import { Box, Tab, Tabs, Typography } from "@mui/material";
import MetahkgLogo from "../components/logo";
import {
    useDarkMode,
    useIsSmallScreen,
    useServerConfig,
    useUser,
} from "../components/AppContextProvider";
import { useEffect, useLayoutEffect, useState } from "react";
import { Category, Comment, Group, Numbers } from "@mui/icons-material";
import CategoriesBoard from "../components/dashboard/categories/categoriesBoard";
import { useNavigate } from "react-router-dom";
import UsersBoard from "../components/dashboard/users/usersBoard";
import { setTitle } from "../lib/common";
import { useMenu } from "../components/MenuProvider";
import ThreadsBoard from "../components/dashboard/threads/threadsBoard";
import InviteCodesBoard from "../components/dashboard/invite-codes/InviteCodesBoard";

export default function Dashboard() {
    const darkMode = useDarkMode();
    const [tab, setTab] = useState<"categories" | "users" | "threads" | "invitecodes">(
        (localStorage.getItem("admindashboard_tab") as
            | "categories"
            | "users"
            | "invitecodes") || "categories"
    );
    const [serverConfig] = useServerConfig();
    const [user] = useUser();
    const navigate = useNavigate();
    const isSmallScreen = useIsSmallScreen();
    const [menu, setMenu] = useMenu();

    useLayoutEffect(() => {
        setTitle(`Admin Dashboard | ${serverConfig?.branding || "Metahkg"}`);
        menu && setMenu(false);
    }, [menu, setMenu, serverConfig?.branding]);

    useLayoutEffect(() => {
        if (user?.role !== "admin") {
            navigate("/404");
        }
    }, [navigate, user?.role]);

    useEffect(() => {
        if (localStorage.getItem("admindashboard_tab") || tab !== "categories") {
            localStorage.setItem("admindashboard_tab", tab);
        }
    }, [tab]);

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
                            <Tab
                                value={"threads"}
                                label="Threads"
                                icon={<Comment />}
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
                    {tab === "threads" && <ThreadsBoard />}
                    {tab === "invitecodes" && <InviteCodesBoard />}
                </Box>
            </Box>
        </Box>
    );
}
