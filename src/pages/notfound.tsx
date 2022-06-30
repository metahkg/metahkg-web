import "../css/pages/notfound.css";
import React from "react";
import { Box } from "@mui/material";
import MetahkgLogo from "../components/logo";
import { useMenu } from "../components/MenuProvider";
import { setTitle } from "../lib/common";

/**
 * 404 page
 */
export default function NotFound() {
    const [menu, setMenu] = useMenu();

    setTitle("404 Not Found | Metahkg");
    menu && setMenu(false);

    return (
        <Box
            className="flex align-center justify-center notfound-root"
            sx={{ bgcolor: "primary.dark" }}
        >
            <MetahkgLogo className="mr10 mb20" svg light height={100} width={80} />
            <h1>404 Not Found</h1>
        </Box>
    );
}
