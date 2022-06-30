import { jsx as _jsx } from "react/jsx-runtime";
import "./css/logo.css";
/**
 * @description Metahkg logo, in different formats
 */
export default function MetahkgLogo(props) {
    const { light, dark, ua, text, filled, svg, height, width, sx, className } = props;
    return (_jsx("img", { className: svg && light ? `svgwhite ${className}` : className, style: sx, src: (svg && "/images/logo.svg") ||
            (light &&
                (filled
                    ? "/images/logo-white-filled.png"
                    : "/images/logo-white.png")) ||
            (text && "/images/logo_with_text.png") ||
            (dark && "/images/logo.png") ||
            (ua && "/images/metahkg-ua.png") ||
            "/images/logo.png", alt: "Metahkg Logo", height: height, width: width }));
}
//# sourceMappingURL=logo.js.map