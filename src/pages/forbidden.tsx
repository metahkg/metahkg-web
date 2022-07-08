import "../css/pages/notfound.css";
import React, { useLayoutEffect } from "react";
import { Box } from "@mui/material";
import MetahkgLogo from "../components/logo";
import { useMenu } from "../components/MenuProvider";
import { setTitle } from "../lib/common";

/**
 * 403 page
 */
export default function Forbidden() {
    const [menu, setMenu] = useMenu();

    useLayoutEffect(() => {
        setTitle("403 Forbidden | Metahkg");
        menu && setMenu(false);
    }, [menu, setMenu]);

    return (
        <Box
            className="flex align-center justify-center notfound-root"
            sx={{ bgcolor: "primary.dark" }}
        >
            <MetahkgLogo className="mr10 mb20" svg light height={100} width={80} />
            <h1>403 Forbidden</h1>
        </Box>
    );
}
