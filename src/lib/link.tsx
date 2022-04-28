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
