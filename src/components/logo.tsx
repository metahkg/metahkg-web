import "./css/logo.css";
import React from "react";

/**
 * @description Metahkg logo, in different formats
 */
export default function MetahkgLogo(props: { light?: boolean; dark?: boolean; ua?: boolean; text?: boolean; filled?: boolean; svg?: boolean; height: number; width: number; sx?: React.CSSProperties; className?: string }) {
    const { light, dark, ua, text, filled, svg, height, width, sx, className } = props;
    return <img className={svg && light ? `svgwhite ${className}` : className} style={sx} src={(svg && "/images/logo.svg") || (light && (filled ? "/images/logo-white-filled.png" : "/images/logo-white.png")) || (text && "/images/logo_with_text.png") || (dark && "/images/logo.png") || (ua && "/images/metahkg-ua.png") || "/images/logo.png"} alt="Metahkg Logo" height={height} width={width} />;
}
