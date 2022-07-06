import { Box, CircularProgress, SxProps, Theme } from "@mui/material";

export default function Loader(props: {
    sxBox?: SxProps<Theme>;
    sxProgress?: SxProps<Theme>;
    position?: "center" | "flex-start" | "flex-end";
    className?: string;
    size?: number;
    thickness?: number;
}) {
    const { sxBox, position, className, sxProgress, size, thickness } = props;
    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                justifyContent: position || "center",
                marginTop: 2,
                ...sxBox,
            }}
            className={className}
        >
            <CircularProgress
                color="secondary"
                sx={sxProgress}
                size={size}
                thickness={thickness}
            />
        </Box>
    );
}
