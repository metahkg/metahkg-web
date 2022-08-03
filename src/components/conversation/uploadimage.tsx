import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios, { AxiosResponse } from "axios";
import { FileUpload } from "@mui/icons-material";

const Input = styled("input")({
    display: "none",
});
/**
 * It's a form that uploads an image to the server
 * @returns A form with a file input.
 */
export default function UploadImage(props: {
    className?: string;
    onUpload?: () => void;
    onSuccess: (res: AxiosResponse<any, any>) => void;
    onError: (err: any) => void;
}) {
    const { className, onUpload, onSuccess, onError } = props;
    return (
        <Box className={className}>
            <form name="image" encType="multipart/form-data">
                <label htmlFor="upload-image">
                    <Input
                        accept="image/*"
                        id="upload-image"
                        type="file"
                        name="image"
                        onChange={(e) => {
                            onUpload && onUpload();
                            const formData = new FormData();
                            formData.append("image", e.target.files?.[0] || "");
                            axios
                                .post("https://api.na.cx/upload", formData, {
                                    headers: {
                                        "Content-Type": "multipart/form-data",
                                    },
                                })
                                .then(onSuccess)
                                .catch(onError);
                        }}
                    />
                    <Button
                        className="!normal-case"
                        variant="contained"
                        component="span"
                    >
                        <FileUpload className="!mr-[5px]" />
                        <Typography sx={{ color: "secondary.main" }}>
                            Upload Image
                        </Typography>
                    </Button>
                </label>
            </form>
        </Box>
    );
}
