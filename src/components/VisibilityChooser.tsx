import { Visibility } from "@metahkg/api";
import { useTranslation } from "react-i18next";
import { HelpOutline as HelpOutlineIcon } from "@mui/icons-material";
import { Box, Checkbox, FormControlLabel, Tooltip, Typography } from "@mui/material";

import { memo } from "react";
const VisibilityChooser = memo(function VisibilityChooser(props: {
    visibility: Visibility;
    setVisibility: React.Dispatch<React.SetStateAction<Visibility>>;
    disabled?: boolean;
    className?: string;
    title?: string;
}) {
    const { t } = useTranslation();
    const { visibility, setVisibility, disabled, className, title } = props;

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
                        <Typography variant="body1">
                            {title || t("visibilityChooser.internal_comment")}
                        </Typography>
                        <Tooltip
                            arrow
                            title={t(
                                "visibilityChooser.internal_comment_tooltip_message"
                            )}
                        >
                            <HelpOutlineIcon className="hover:bg-[rgba(255,255,255,0.2)] ml-1 rounded-md" />
                        </Tooltip>
                    </Box>
                }
            />
        </Box>
    );
});
export default VisibilityChooser;
