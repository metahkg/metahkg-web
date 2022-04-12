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
            fontFamily: [
                "Segoe UI",
                "Open Sans",
                "Helvetica Neue",
                "Helvetica",
                "Arial",
                "Microsoft JhengHei",
                "sans-serif",
            ].join(","),
        },
    });
    return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
}
