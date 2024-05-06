/*
 Copyright (C) 2022-present Wong Chun Yat (wcyat)

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
import { css } from "../lib/css";

/**
 * @description Metahkg logo, in different formats
 */
import { memo } from "react";
const MetahkgLogo = memo(function MetahkgLogo(props: {
    light?: boolean;
    dark?: boolean;
    text?: boolean;
    filled?: boolean;
    svg?: boolean;
    height: number;
    width: number;
    sx?: React.CSSProperties;
    className?: string;
}) {
    const { light, dark, text, filled, svg, height, width, sx, className } = props;
    return (
        <img
            className={`${svg && light ? css.svgwhite : ""} ${className || ""}`}
            style={sx}
            src={
                (svg && "/images/logo.svg") ||
                (light &&
                    (filled
                        ? "/images/logo-white-filled.png"
                        : "/images/logo-white.png")) ||
                (text && "/images/logo_with_text.png") ||
                (dark && "/images/logo.png") ||
                "/images/logo.png"
            }
            alt="Metahkg Logo"
            height={height}
            width={width}
        />
    );
});
export default MetahkgLogo;
