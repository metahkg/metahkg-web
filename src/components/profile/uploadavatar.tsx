import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FileUpload } from "@mui/icons-material";

const Input = styled("input")({
    display: "none",
});
/**
 * It's a form that uploads an image to the server
 * @returns A form with a file input.
 */
export default function UploadAvatar(props: {
    onChange?: (file: File) => void;
}) {
    const { onChange } = props;
    return (
        <Box component="form" encType="multipart/form-data">
            <label htmlFor="contained-button-file">
                <Input
                    accept="image/*"
                    id="contained-button-file"
                    type="file"
                    name="avatar"
                    onChange={(e) => {
                        const avatar = e?.target?.files?.[0];
                        if (avatar) onChange?.(avatar);
                    }}
                />
                <Button
                    className="!mt-[5px] !normal-case"
                    variant="contained"
                    component="span"
                >
                    <FileUpload className="!mr-[5px]" />
                    <Typography sx={{ color: "secondary.main" }}>Upload</Typography>
                </Button>
            </label>
        </Box>
    );
}
