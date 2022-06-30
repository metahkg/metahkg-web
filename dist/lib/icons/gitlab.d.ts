/// <reference types="react" />
/**
 * It creates a SVG gitlab icon.
 * @param {number} props.width Width of the icon
 * @param {number} props.height Height of the icon
 * @param {string} props.color custom fill color (default is none)
 * @param {boolean} props.white use white for fill
 * @param {boolean} props.black use black for fill
 * @returns An SVG element.
 */
export default function GitlabIcon(props: {
    /** svg width */
    width?: number;
    /** svg height */
    height?: number;
    /** fill color */
    color?: string;
    /** use #ffffff */
    white?: boolean;
    /** use #000000 */
    black?: boolean;
    /** className */
    className?: string;
}): JSX.Element;
