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
import { Box, IconButton } from "@mui/material";
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
    onChange?: (file: File) => void | Promise<void>;
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
                    onChange={async (e) => {
                        const avatar = e?.target?.files?.[0];
                        if (avatar) {
                            await onChange?.(avatar);
                        }
                    }}
                />
                <IconButton
                    className="!mt-[5px] !normal-case"
                    sx={{
                        bgcolor: "primary.main",
                        "&:hover": { bgcolor: "primary.main" },
                    }}
                    component="span"
                >
                    <FileUpload />
                </IconButton>
            </label>
        </Box>
    );
}
