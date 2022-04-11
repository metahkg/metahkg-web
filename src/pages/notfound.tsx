import "./css/notfound.css";
import React from "react";
import { Box } from "@mui/material";
import MetahkgLogo from "../components/logo";
import { useMenu } from "../components/MenuProvider";

/**
 * 404 page
 */
export default function NotFound() {
    document.title = "404 Not Found | Metahkg";
    const [menu, setMenu] = useMenu();
    menu && setMenu(false);
    return (
        <Box className="flex align-center justify-center notfound-root" sx={{ bgcolor: "primary.dark" }}>
            <MetahkgLogo className="mr10 mb20" svg light height={100} width={80} />
            <h1>404 Not Found</h1>
        </Box>
    );
}
