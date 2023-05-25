import { Visibility } from "@metahkg/api";
import { HelpOutline as HelpOutlineIcon } from "@mui/icons-material";
import { Box, Checkbox, FormControlLabel, Tooltip, Typography } from "@mui/material";

export default function VisibilityChooser(props: {
    visibility: Visibility;
    setVisibility: React.Dispatch<React.SetStateAction<Visibility>>;
    disabled?: boolean;
    className?: string;
}) {
    const { visibility, setVisibility, disabled, className } = props;

    return (
        <Box className={className}>
            <FormControlLabel
                control={
                    <Checkbox
                        color="secondary"
                        onChange={(e) => {
                            setVisibility(e.target.checked ? "internal" : "public");
                        }}
                        disabled={disabled}
                        checked={visibility === "internal"}
                    />
                }
                label={
                    <Box className="flex">
                        <Typography variant="body1">Internal comment</Typography>
                        <Tooltip
                            arrow
                            title="Internal comments can only be seen by logged in users. All replies will also be made internal."
                        >
                            <HelpOutlineIcon className="hover:bg-[rgba(255,255,255,0.2)] ml-1 rounded-md" />
                        </Tooltip>
                    </Box>
                }
            />
        </Box>
    );
}
