/*
 Copyright (C) 2022-present Metahkg Contributors

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from "react";
import { PaletteColorOptions } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

declare module "@mui/material/styles" {
    interface Theme {
        status: {
            danger: string;
        };
    }

    interface ThemeOptions {
        status?: {
            danger?: string;
        };
    }
}
export default function Theme(props: {
    primary?: PaletteColorOptions;
    secondary?: PaletteColorOptions;
    children: JSX.Element | JSX.Element[];
}) {
    const theme = createTheme({
        palette: {
            mode: "dark",
            primary: props.primary,
            secondary: props.secondary,
        },
        typography: {
            fontFamily: ["Roboto", "Arial", "sans-serif"].join(","),
        },
    });
    return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
}
