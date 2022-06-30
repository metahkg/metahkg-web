import { jsx as _jsx } from "react/jsx-runtime";
import { Suspense } from "react";
import Img from "react-cool-img";
import Spinner from "react-spinner-material";
import { useImage } from "react-image";
import { CSSstring } from "../../../lib/cssstring";
import ImageErrorBoundary from "./ImageErrorBoundary";
import { PhotoView } from "react-photo-view";
function ImgComponent(props) {
    const { height, style, width } = props;
    const { src } = useImage({ srcList: props.src });
    return (_jsx(PhotoView, Object.assign({ src: src }, { children: _jsx(Img, { src: src, alt: "", style: CSSstring(String(style)), height: height, width: width, lazy: true }) })));
}
export default function Image(props) {
    const { height, style, width, src } = props;
    return (_jsx(Suspense, Object.assign({ fallback: _jsx("a", Object.assign({ href: src, target: "_blank", rel: "noreferrer" }, { children: _jsx(Spinner, { className: "mt5 mb5", radius: 50, color: "gray", stroke: 3, visible: true }) })) }, { children: _jsx(ImageErrorBoundary, Object.assign({ src: src }, { children: _jsx(ImgComponent, { src: src, height: height, width: width, style: style }) })) })));
}
//# sourceMappingURL=Image.js.map