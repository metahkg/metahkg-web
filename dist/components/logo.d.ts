import "./css/logo.css";
import React from "react";
/**
 * @description Metahkg logo, in different formats
 */
export default function MetahkgLogo(props: {
    light?: boolean;
    dark?: boolean;
    ua?: boolean;
    text?: boolean;
    filled?: boolean;
    svg?: boolean;
    height: number;
    width: number;
    sx?: React.CSSProperties;
    className?: string;
}): JSX.Element;
