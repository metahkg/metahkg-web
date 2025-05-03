import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
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
import { memo } from "react";
const Dashboard = memo(function Dashboard() {
    const { t } = useTranslation();
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
        setTitle(
            t("dashboard.title") + ` | ${serverConfig?.branding || t("common.branding")}`
        );
        menu && setMenu(false);
    }, [menu, setMenu, serverConfig?.branding, t]);

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
                    <Typography variant="h4">{t("dashboard.title")}</Typography>
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
                                label={t("dashboard.categories_tab")}
                                icon={<Category />}
                                iconPosition="start"
                                disableRipple
                            />
                            <Tab
                                value={"users"}
                                label={t("dashboard.users_tab")}
                                icon={<Group />}
                                iconPosition="start"
                                disableRipple
                            />
                            <Tab
                                value={"threads"}
                                label={t("dashboard.threads_tab")}
                                icon={<Comment />}
                                iconPosition="start"
                                disableRipple
                            />
                            {serverConfig?.register.mode === "invite" && (
                                <Tab
                                    value={"invitecodes"}
                                    label={t("dashboard.invite_codes_tab")}
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
});
export default Dashboard;
