import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { BrokenImage } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
export default class ImageErrorBoundary extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    render() {
        const { src } = this.props;
        if (this.state.hasError) {
            return (_jsx(Tooltip, Object.assign({ arrow: true, title: _jsx("a", Object.assign({ className: "link white-force", href: src, target: "_blank", rel: "noreferrer" }, { children: src })) }, { children: _jsxs("div", Object.assign({ className: "pointer display-inline-block" }, { children: [_jsx("img", { src: src, alt: "", className: "display-none" }), _jsx(BrokenImage, {})] })) })));
        }
        return this.props.children;
    }
}
//# sourceMappingURL=ImageErrorBoundary.js.map