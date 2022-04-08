import React from "react";
import {Box, Button, Typography} from "@mui/material";
import {styled} from "@mui/material/styles";
import axios, {AxiosResponse} from "axios";
import {FileUpload} from "@mui/icons-material";

const Input = styled("input")({
    display: "none",
});
/**
 * It's a form that uploads an image to the server
 * @returns A form with a file input.
 */
export default function UploadImage(props: {
    onUpload?: () => void;
    onSuccess: (res: AxiosResponse<any, any>) => void;
    onError: (err: any) => void;
}) {
    const {onUpload, onSuccess, onError} = props;
    return (
        <Box>
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
                            formData.append("image", e?.target?.files?.[0] || "");
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
                        className="notexttransform"
                        variant="contained"
                        component="span"
                    >
                        <FileUpload className="mr5"/>
                        <Typography sx={{color: "secondary.main"}}>
                            Upload Image
                        </Typography>
                    </Button>
                </label>
            </form>
        </Box>
    );
}
