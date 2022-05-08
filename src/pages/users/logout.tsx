import React from "react";
import { Alert, Box } from "@mui/material";
import { useMenu } from "../../components/MenuProvider";
import queryString from "query-string";
import { useNavigate } from "react-router-dom";
import { useNotification, useUser } from "../../components/ContextProvider";

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

    (function onRender() {
        menu && setMenu(false);

        // logout
        localStorage.removeItem("token");
        setUser(null);

        // go back
        navigate(decodeURIComponent(String(query.returnto || "/")), {
            replace: true,
        });
        setNotification({ open: true, text: "Logged out." });
    })();

    return (
        <Box
            className="min-height-fullvh justify-center width-fullvw"
            sx={{
                backgroundColor: "primary.dark",
            }}
        >
            <div className="flex fullwidth justify-center">
                <Alert className="mt30 halfwidth" severity="info">
                    Logging you out...
                </Alert>
            </div>
        </Box>
    );
}
