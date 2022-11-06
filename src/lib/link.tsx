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
export function Link(props: {
    to: string;
    children: JSX.Element | JSX.Element[];
    className?: string;
    style?: React.StyleHTMLAttributes<HTMLElement>;
}) {
    const { to, children, className, style } = props;
    return (
        <React.Fragment>
            {to.startsWith("/") ? (
                <InternalLink to={to} className={className} style={style}>
                    {children}
                </InternalLink>
            ) : (
                <a href={to} className={className} style={style}>
                    {children}
                </a>
            )}
        </React.Fragment>
    );
}
