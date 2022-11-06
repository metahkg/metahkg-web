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
