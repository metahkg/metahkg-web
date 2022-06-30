import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useIsSmallScreen, useNotification, useUser } from "../ContextProvider";
import { useData } from "../MenuProvider";
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableRow, TextField, } from "@mui/material";
import { decodeToken, timeToWord_long } from "../../lib/common";
import { api, resetApi } from "../../lib/api";
import { Save } from "@mui/icons-material";
import { parseError } from "../../lib/parseError";
export default function DataTable(props) {
    const { requestedUser, setUser, isSelf } = props;
    const isSmallScreen = useIsSmallScreen();
    const [, setData] = useData();
    const [, setNotification] = useNotification();
    const [name, setName] = useState(requestedUser.name);
    const [saveDisabled, setSaveDisabled] = useState(false);
    const [, setClient] = useUser();
    const items = [
        {
            title: "Name",
            content: isSelf ? (_jsx(TextField, { variant: "standard", color: "secondary", value: name, onChange: (e) => {
                    setName(e.target.value);
                } })) : (requestedUser.name),
        },
        {
            title: "Threads",
            content: requestedUser.count,
        },
        {
            title: "Gender",
            content: { M: "male", F: "female" }[requestedUser.sex] || "",
        },
        { title: "Role", content: requestedUser.role },
        {
            title: "Joined",
            content: `${timeToWord_long(requestedUser.createdAt)} ago`,
        },
    ];
    function rename() {
        setSaveDisabled(true);
        setNotification({ open: true, text: "Renaming..." });
        api.users
            .rename({ name })
            .then((res) => {
            var _a;
            setSaveDisabled(false);
            setUser(null);
            const { token } = res.data;
            if (token) {
                localStorage.setItem("token", token);
                setClient(decodeToken(token));
                resetApi();
            }
            setData([]);
            setNotification({ open: true, text: (_a = res.data) === null || _a === void 0 ? void 0 : _a.response });
        })
            .catch((err) => {
            setSaveDisabled(false);
            setNotification({
                open: true,
                text: parseError(err),
            });
        });
    }
    return (_jsxs(Box, Object.assign({ className: "ml50 mr50 fullwidth", style: { maxWidth: isSmallScreen ? "100%" : "70%" } }, { children: [_jsx(TableContainer, Object.assign({ className: "fullwidth", component: Paper }, { children: _jsx(Table, Object.assign({ className: "fullwidth", "aria-label": "simple table" }, { children: _jsx(TableBody, { children: items.map((item) => (_jsxs(TableRow, Object.assign({ sx: { "&:last-child td, &:last-child th": { border: 0 } } }, { children: [_jsx(TableCell, Object.assign({ component: "th", scope: "row", className: "font-size-16-force" }, { children: item.title })), _jsx(TableCell, Object.assign({ component: "th", scope: "row", className: "font-size-16-force" }, { children: item.content }))] })))) }) })) })), isSelf && (_jsxs(Button, Object.assign({ className: "mt20 mb10", variant: "contained", disabled: saveDisabled || name === requestedUser.name, color: "secondary", onClick: rename }, { children: [_jsx(Save, {}), "Save"] })))] })));
}
//# sourceMappingURL=DataTable.js.map