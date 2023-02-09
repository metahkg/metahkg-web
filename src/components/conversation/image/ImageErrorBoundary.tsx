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
import { BrokenImage } from "@mui/icons-material";
import { Box, Tooltip } from "@mui/material";
import { css } from "../../../lib/css";

export default class ImageErrorBoundary extends React.Component<{
    src: string;
    children: JSX.Element;
}> {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        const { src } = this.props;
        if (this.state.hasError) {
            return (
                <Tooltip
                    arrow
                    title={
                        <a
                            className={`${css.link} !text-inherit`}
                            href={src}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {src}
                        </a>
                    }
                >
                    <Box className="cursor-pointer inline-block">
                        <BrokenImage />
                    </Box>
                </Tooltip>
            );
        }
        return this.props.children;
    }
}
