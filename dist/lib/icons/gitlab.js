import { jsx as _jsx } from "react/jsx-runtime";
/**
 * It creates a SVG gitlab icon.
 * @param {number} props.width Width of the icon
 * @param {number} props.height Height of the icon
 * @param {string} props.color custom fill color (default is none)
 * @param {boolean} props.white use white for fill
 * @param {boolean} props.black use black for fill
 * @returns An SVG element.
 */
export default function GitlabIcon(props) {
    const { width, height, color, white, black, className } = props;
    return (_jsx("svg", Object.assign({ xmlns: "http://www.w3.org/2000/svg", width: width || 21, height: height || 21, viewBox: "0 0 24 24", fill: (white && "#ffffff") || (black && "#000000") || color || "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: className }, { children: _jsx("path", { d: "M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z" }) })));
}
//# sourceMappingURL=gitlab.js.map