import React, { useLayoutEffect, useState, useEffect } from "react";
import { Box } from "@mui/material";
import Template from "../components/template";
import {
    useBack,
    useIsSmallScreen,
    useServerConfig,
    useFollowingList,
} from "../components/AppContextProvider";
import {
    useReFetch,
    useMenu,
    useMenuMode,
    useSelected,
    useMenuTitle,
} from "../components/MenuProvider";
import { setTitle } from "../lib/common";
import { api } from "../lib/api";
import { memo } from "react";
const Following = memo(function Following() {
    const [menu, setMenu] = useMenu();
    const [back, setBack] = useBack();
    const [menuMode, setMenuMode] = useMenuMode();
    const [, setReFetch] = useReFetch();
    const isSmallScreen = useIsSmallScreen();
    const [title, setMenuTitle] = useMenuTitle();
    const [selected, setSelected] = useSelected();
    const [serverConfig] = useServerConfig();
    const [followingList] = useFollowingList();
    const [, setUsers] = useState<any[]>([]);

    useLayoutEffect(() => {
        setTitle(`Following | ${serverConfig?.branding || "Metahkg"}`);

        function clearData() {
            setReFetch(true);
            title && setMenuTitle("");
            selected && setSelected(0);
        }

        back !== window.location.pathname && setBack(window.location.pathname);
        !menu && setMenu(true);

        if (menuMode !== "following") {
            clearData();
            setMenuMode("following");
        }
    }, [back, menu, menuMode, selected, serverConfig?.branding, setBack, setMenu, setMenuMode, setMenuTitle, setReFetch, setSelected, title]);

    useEffect(() => {
        const fetchUsers = async () => {
            const userPromises = followingList.map((followedUser) =>
                api.userName(followedUser.id)
            );
            const usersData = await Promise.all(userPromises);
            setUsers(usersData);
        };

        fetchUsers();
    }, [followingList]);

    return (
        <Box
            sx={{
                backgroundColor: "primary.dark",
            }}
        >
            {!isSmallScreen && <Template />}
        </Box>
    );
});
export default Following;
