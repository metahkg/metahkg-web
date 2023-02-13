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

import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FileUpload } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

const Input = styled("input")({
    display: "none",
});

/**
 * It's a form that uploads an image to the server
 * @returns A form with a file input.
 */
export default function UploadAvatar(props: {
    onChange?: (file: File) => void | Promise<void>;
}) {
    const { onChange } = props;
    const [uploading, setUploading] = React.useState(false);

    return (
        <Box component="form" encType="multipart/form-data">
            <label htmlFor="contained-button-file">
                <Input
                    accept="image/*"
                    id="contained-button-file"
                    type="file"
                    name="avatar"
                    onChange={async (e) => {
                        const avatar = e?.target?.files?.[0];
                        if (avatar) {
                            setUploading(true);
                            await onChange?.(avatar);
                            setUploading(false);
                        }
                    }}
                />
                <LoadingButton
                    className="!mt-[5px] !normal-case"
                    variant="contained"
                    component="span"
                    loading={uploading}
                    startIcon={<FileUpload />}
                    loadingPosition="start"
                >
                    <Typography sx={{ color: "secondary.main" }}>Upload</Typography>
                </LoadingButton>
            </label>
        </Box>
    );
}
