import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { GitHub, Telegram } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import GitlabIcon from "../../lib/icons/gitlab";
export default function PageBottom() {
    const socialicons = [
        {
            icon: _jsx(GitlabIcon, { className: "metahkg-grey-force", height: 17, width: 17 }),
            link: "https://gitlab.com/metahkg",
        },
        {
            icon: _jsx(GitHub, { className: "font-size-17-force metahkg-grey-force" }),
            link: "https://github.com/metahkg",
        },
        {
            icon: _jsx(Telegram, { className: "font-size-17-force metahkg-grey-force" }),
            link: "https://t.me/+WbB7PyRovUY1ZDFl",
        },
    ];
    return (_jsxs("div", Object.assign({ className: "font-size-14 metahkg-grey-force text-align-center flex flex-dir-column justify-center align-center max-width-full max-height-full mt10 mb55" }, { children: [_jsx("div", Object.assign({ className: "flex" }, { children: socialicons.map((icon, index) => (_jsx("a", Object.assign({ className: `metahkg-grey-force notextdecoration${index !== socialicons.length - 1 ? " mr7" : ""}`, href: icon.link, target: "_blank", rel: "noreferrer" }, { children: _jsx(IconButton, Object.assign({ className: "nopadding" }, { children: icon.icon })) }), index))) })), _jsxs("div", Object.assign({ className: "mt8" }, { children: ["Copyright (c) 2022 Metahkg.", " ", _jsx("a", Object.assign({ className: "metahkg-grey-force", href: "https://www.gnu.org/licenses/agpl-3.0.en.html", target: "_blank", rel: "noreferrer" }, { children: "AGPL-3.0" })), "."] }))] })));
}
//# sourceMappingURL=pagebottom.js.map