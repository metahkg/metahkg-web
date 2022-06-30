import { jsx as _jsx } from "react/jsx-runtime";
import { createTheme, ThemeProvider } from "@mui/material/styles";
export default function Theme(props) {
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
    return _jsx(ThemeProvider, Object.assign({ theme: theme }, { children: props.children }));
}
//# sourceMappingURL=theme.js.map