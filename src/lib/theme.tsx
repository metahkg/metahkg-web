import React from "react";
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
export default function Theme(props: any) {
  const theme = createTheme({
    palette: {
      mode: "dark",
      primary: props.primary,
      secondary: props.secondary,
    },
    typography: {
      fontFamily: [
        "Segoe UI",
        "Helvetica Neue",
        "Helvetica",
        "Tahoma",
        "Geneva",
        "Verdana",
        "sans-serif",
      ].join(","),
    },
  });
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
}
