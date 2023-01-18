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
    href?: string;
    children: JSX.Element | JSX.Element[];
    className?: string;
    style?: React.StyleHTMLAttributes<HTMLElement>;
    target?: "_blank" | "_self" | "_parent" | "_top";
    rel?: string;
}) {
    const { href, children, className, style, target, rel } = props;
    return (
        <React.Fragment>
            {href ? (
                href.startsWith("/") ? (
                    <InternalLink to={href} className={className} style={style}>
                        {children}
                    </InternalLink>
                ) : (
                    <a
                        href={href}
                        className={className}
                        style={style}
                        target={target}
                        rel={rel || "noreferrer"}
                    >
                        {children}
                    </a>
                )
            ) : (
                children
            )}
        </React.Fragment>
    );
}
