/// <reference types="react" />
import { PaletteColorOptions } from "@mui/material";
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
}): JSX.Element;
