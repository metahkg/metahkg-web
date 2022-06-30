import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AccountCircle as AccountCircleIcon, Code as CodeIcon, Create as CreateIcon, Logout as LogoutIcon, ManageAccounts as ManageAccountsIcon, Telegram as TelegramIcon, } from "@mui/icons-material";
import { List, ListItemButton, ListItemIcon, ListItemText, Paper } from "@mui/material";
import { Link } from "../lib/link";
import MetahkgIcon from "./logo";
import MetahkgLogo from "./logo";
import { wholePath } from "../lib/common";
import { useUser } from "./ContextProvider";
/**
 * just a template for large screens if there's no content
 * e.g. /category/:id, in which there's no main content but only the menu
 */
export default function Template() {
    /* It's a list of objects. */
    const links = [
        {
            icon: _jsx(CreateIcon, {}),
            title: "Create thread",
            link: "/create",
        },
        {
            icon: _jsx(TelegramIcon, {}),
            title: "Telegram group",
            link: "https://t.me/+WbB7PyRovUY1ZDFl",
        },
        {
            icon: _jsx(CodeIcon, {}),
            title: "Source code",
            link: "https://gitlab.com/metahkg/metahkg",
        },
    ];
    const [user] = useUser();
    return (_jsx(Paper, Object.assign({ className: "overflow-auto justify-center flex max-height-fullvh", sx: {
            bgcolor: "primary.dark",
            width: "70vw",
        } }, { children: _jsxs("div", Object.assign({ className: "fullwidth m50" }, { children: [_jsxs("div", Object.assign({ className: "flex align-center" }, { children: [_jsx(MetahkgIcon, { height: 40, width: 50, svg: true, light: true }), _jsx("h1", { children: "Metahkg" })] })), _jsxs(List, { children: [_jsxs(ListItemButton, Object.assign({ className: "fullwidth text-decoration-none white", component: "a", href: "https://war.ukraine.ua/support-ukraine/" }, { children: [_jsx(ListItemIcon, { children: _jsx(MetahkgLogo, { ua: true, height: 24, width: 30 }) }), _jsx(ListItemText, { children: "Support Ukraine" })] })), _jsxs(ListItemButton, Object.assign({ component: Link, className: "notextdecoration white fullwidth", to: `/${user ? "users/logout" : "users/login"}?returnto=${encodeURIComponent(wholePath())}` }, { children: [_jsx(ListItemIcon, { children: user ? _jsx(LogoutIcon, {}) : _jsx(AccountCircleIcon, {}) }), _jsx(ListItemText, { children: user ? "Logout" : "Login / Register" })] })), user && (_jsxs(ListItemButton, Object.assign({ component: Link, to: `/profile/${user === null || user === void 0 ? void 0 : user.id}`, className: "fullwidth text-decoration-none white" }, { children: [_jsx(ListItemIcon, { children: _jsx(ManageAccountsIcon, {}) }), _jsx(ListItemText, { children: user === null || user === void 0 ? void 0 : user.name })] }))), links.map((link, index) => (_jsxs(ListItemButton, Object.assign({ component: Link, to: link.link, className: "fullwidth text-decoration-none white" }, { children: [_jsx(ListItemIcon, { children: link.icon }), _jsx(ListItemText, { children: link.title })] }), index)))] })] })) })));
}
//# sourceMappingURL=template.js.map