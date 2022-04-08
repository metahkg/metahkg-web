import "./css/notfound.css";
import React from "react";
import {Box} from "@mui/material";
import MetahkgLogo from "../components/logo";
import {useMenu} from "../components/MenuProvider";

/**
 * 401 page
 */
export default function Forbidden() {
    document.title = "401 Forbidden | Metahkg";
    const [menu, setMenu] = useMenu();
    menu && setMenu(false);
    return (
        <Box
            className="flex align-center justify-center notfound-root"
            sx={{bgcolor: "primary.dark"}}
        >
            <MetahkgLogo className="mr10 mb20" svg light height={100} width={80}/>
            <h1>401 Forbidden</h1>
        </Box>
    );
}
