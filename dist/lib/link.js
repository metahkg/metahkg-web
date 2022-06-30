import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import { Link as InternalLink } from "react-router-dom";
export function Link(props) {
    const { to, children, className, style } = props;
    return (_jsx(React.Fragment, { children: to.startsWith("/") ? (_jsx(InternalLink, Object.assign({ to: to, className: className, style: style }, { children: children }))) : (_jsx("a", Object.assign({ href: to, className: className, style: style }, { children: children }))) }));
}
//# sourceMappingURL=link.js.map