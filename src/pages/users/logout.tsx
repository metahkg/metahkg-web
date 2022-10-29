import React, { useEffect, useLayoutEffect } from "react";
import { Alert, Box } from "@mui/material";
import { useMenu } from "../../components/MenuProvider";
import queryString from "query-string";
import { useNavigate } from "react-router-dom";
import { useNotification, useUser } from "../../components/AppContextProvider";
import { setTitle } from "../../lib/common";
import { api } from "../../lib/api";
import { parseError } from "../../lib/parseError";

/**
 * Renders an alert while logging out.
 * @returns an info alert
 */
export default function Logout() {
    const [menu, setMenu] = useMenu();
    const [, setNotification] = useNotification();
    const [, setUser] = useUser();
    const navigate = useNavigate();
    const query = queryString.parse(window.location.search);

    useLayoutEffect(() => {
        setTitle("Logout | Metahkg");

        menu && setMenu(false);
    }, [menu, setMenu]);

    useEffect(() => {
        api.meLogout()
            .then(() => {
                // logout
                localStorage.removeItem("token");
                setUser(null);
                setNotification({ open: true, severity: "info", text: "Logged out." });
            })
            .catch((err) => {
                setNotification({ open: true, severity: "error", text: parseError(err) });
            });

        // go back
        navigate(decodeURIComponent(String(query.returnto || "/")), {
            replace: true,
        });
    }, [navigate, query.returnto, setNotification, setUser]);

    return (
        <Box
            className="min-h-screen justify-center w-screen"
            sx={{
                backgroundColor: "primary.dark",
            }}
        >
            <Box className="flex w-full justify-center">
                <Alert className="!mt-[30px] w-1/2" severity="info">
                    Logging you out...
                </Alert>
            </Box>
        </Box>
    );
}
