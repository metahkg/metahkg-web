import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FileUpload } from "@mui/icons-material";
import { AxiosResponse } from "axios";
import { api } from "../lib/api";
import { OK } from "metahkg-api/dist/types/ok";

const Input = styled("input")({
    display: "none",
});
/**
 * It's a form that uploads an image to the server
 * @returns A form with a file input.
 */
export default function UploadAvatar(props: {
    onUpload?: () => void;
    onSuccess: (res: AxiosResponse<OK>) => void;
    onError: (err: any) => void;
}) {
    const { onUpload, onSuccess, onError } = props;
    return (
        <Box>
            <form name="avatar" id="avatar" encType="multipart/form-data">
                <label htmlFor="contained-button-file">
                    <Input
                        accept="image/*"
                        id="contained-button-file"
                        type="file"
                        name="avatar"
                        onChange={(e) => {
                            onUpload && onUpload();
                            const avatar = e?.target?.files?.[0];
                            avatar &&
                                api.users
                                    .uploadAvatar({ avatar })
                                    .then(onSuccess)
                                    .catch(onError);
                        }}
                    />
                    <Button
                        className="mt5 notexttransform"
                        variant="contained"
                        component="span"
                    >
                        <FileUpload className="mr5" />
                        <Typography sx={{ color: "secondary.main" }}>Upload</Typography>
                    </Button>
                </label>
            </form>
        </Box>
    );
}
