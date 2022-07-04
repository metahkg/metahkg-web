import { Box, CircularProgress, SxProps, Theme } from "@mui/material";

export default function Loader(props: {
    sx?: SxProps<Theme>;
    position?: "center" | "flex-start" | "flex-end";
}) {
    const { sx, position } = props;
    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                justifyContent: position || "center",
                marginTop: 2,
                ...sx,
            }}
        >
            <CircularProgress color="secondary" />
        </Box>
    );
}
