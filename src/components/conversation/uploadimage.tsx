/*
 Copyright (C) 2022-present Metahkg Contributors

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios, { AxiosResponse } from "axios";
import { FileUpload } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

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
    const [uploading, setUploading] = useState(false);
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
                            setUploading(true);
                            axios
                                .post("https://api.na.cx/upload", formData, {
                                    headers: {
                                        "Content-Type": "multipart/form-data",
                                    },
                                })
                                .then(onSuccess)
                                .catch(onError);
                            setUploading(false);
                        }}
                    />
                    <LoadingButton
                        loading={uploading}
                        disabled={uploading}
                        className="!normal-case"
                        variant="contained"
                        component="span"
                        startIcon={<FileUpload />}
                        loadingPosition="start"
                    >
                        <Typography sx={{ color: "secondary.main" }}>
                            Upload Image
                        </Typography>
                    </LoadingButton>
                </label>
            </form>
        </Box>
    );
}
