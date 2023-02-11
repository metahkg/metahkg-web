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
import { Link as InternalLink } from "react-router-dom";
import { Box, BoxProps, Link as MuiLink } from "@mui/material";

export function Link(
    props: React.DetailedHTMLProps<
        React.AnchorHTMLAttributes<HTMLAnchorElement>,
        HTMLAnchorElement
    > & {
        ref?: React.RefObject<HTMLAnchorElement>;
        to?: string;
        href?: string;
        children: React.ReactNode;
    }
) {
    const { href, to, children } = props;
    return (
        <React.Fragment>
            {href ? (
                href.startsWith("/") ? (
                    <InternalLink {...props} to={href || to || ""}>
                        {children}
                    </InternalLink>
                ) : (
                    <MuiLink
                        {...props}
                        sx={{ textDecorationColor: "inherit" }}
                        color="#3498db"
                        href={href || to}
                    >
                        {children}
                    </MuiLink>
                )
            ) : (
                <Box {...(props as BoxProps)}>{children}</Box>
            )}
        </React.Fragment>
    );
}
