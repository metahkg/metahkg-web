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
            className="flex items-center justify-center min-h-screen w-screen"
            sx={{ bgcolor: "primary.dark" }}
        >
            <MetahkgLogo
                className="!mr-[10px] !mb-[20px]"
                svg
                light
                height={100}
                width={80}
            />
            <h1>403 Forbidden</h1>
        </Box>
    );
}
