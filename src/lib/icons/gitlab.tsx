/*
Copyright © 2013-2017 Cole Bemis

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

The Software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the Software or the use or other dealings in the Software.
*/
import React from "react";
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
}) {
  const { width, height, color, white, black, className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || 21}
      height={height || 21}
      viewBox="0 0 24 24"
      fill={(white && "#ffffff") || (black && "#000000") || color || "none"}
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={className}
    >
      <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"></path>
    </svg>
  );
}
