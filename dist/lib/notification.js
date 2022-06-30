import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./css/notification.css";
import { Close, Notifications } from "@mui/icons-material";
import { Box, Snackbar } from "@mui/material";
import { useNotification } from "../components/ContextProvider";
/**
 * Display a notification at the top right corner
 */
export function Notification() {
    const [notification, setNotification] = useNotification();
    const open = notification.open;
    return (_jsx(Snackbar, Object.assign({ className: "border-radius-8 notification-root", sx: {
            bgcolor: "primary.main",
        }, anchorOrigin: { horizontal: "right", vertical: "top" }, open: open, autoHideDuration: 3000, onClick: () => {
            setNotification(Object.assign(Object.assign({}, notification), { open: false }));
        }, onClose: () => {
            setNotification(Object.assign(Object.assign({}, notification), { open: false }));
        } }, { children: _jsxs(Box, Object.assign({ className: "fullwidth pointer border-radius-8 notification-mainbox" }, { children: [_jsx(Box, Object.assign({ className: "flex fullwidth font-size-14 notification-top" }, { children: _jsxs("div", Object.assign({ className: "ml15 flex align-center fullwidth justify-space-between" }, { children: [_jsxs("div", Object.assign({ className: "flex align-center" }, { children: [_jsx(Notifications, { className: "metahkg-grey-force font-size-14-force" }), _jsx("p", Object.assign({ className: "metahkg-grey ml10 mt6 mb6" }, { children: "Notification" }))] })), _jsx(Close, { className: "icon-white-onhover metahkg-grey-force font-size-16-force mr12" })] })) })), _jsx(Box, Object.assign({ className: "fullwidth notification-bottom border-radius-8" }, { children: _jsx("p", Object.assign({ className: "m15 text-overflow-ellipsis overflow-hidden font-size-15 notification-text" }, { children: notification.text })) }))] })) })));
}
//# sourceMappingURL=notification.js.map