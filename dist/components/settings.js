import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { PopUp } from "../lib/popup";
import { useSettings } from "./ContextProvider";
import { IOSSwitch } from "../lib/switch";
export default function Settings(props) {
    var _a;
    const { open, setOpen } = props;
    const [settings, setSettings] = useSettings();
    useEffect(() => {
        localStorage.setItem("settings", JSON.stringify(settings));
    }, [settings]);
    const settingItems = [
        {
            title: "Voting Bar",
            action: (e) => {
                setSettings(Object.assign(Object.assign({}, settings), { votebar: e.target.checked }));
            },
            checked: settings.votebar,
        },
    ];
    const colorOptions = [
        { value: "Yellow", main: "#f5bd1f", dark: "#ffc100" },
        { value: "Orange", main: "#ff9800", dark: "#b26a00" },
        { value: "Teal", main: "#009688", dark: "#00695f" },
        { value: "Purple", main: "#651fff", dark: "#4615b2" },
    ];
    return (_jsx(PopUp, Object.assign({ title: "Settings", open: open, setOpen: setOpen, fullWidth: true }, { children: _jsxs(Box, Object.assign({ className: "fullwidth ml20 mr10", sx: { bgcolor: "primary.main" } }, { children: [settingItems.map((item) => (_jsxs("div", Object.assign({ className: "flex justify-space-between align-center fullwidth mt4 mb4" }, { children: [_jsx("p", Object.assign({ className: "nomargin" }, { children: item.title })), _jsx(IOSSwitch, { color: "secondary", checked: item.checked, onChange: item.action })] }), item.title))), _jsxs("div", Object.assign({ className: "flex justify-space-between align-center fullwidth mt6 mb4" }, { children: [_jsx("p", Object.assign({ className: "nomargin" }, { children: "Color" })), _jsx(ToggleButtonGroup, Object.assign({ color: "secondary", value: (_a = colorOptions.find((item) => {
                                var _a;
                                return item.main ===
                                    (((_a = settings.secondaryColor) === null || _a === void 0 ? void 0 : _a.main) || "#f5bd1f");
                            })) === null || _a === void 0 ? void 0 : _a.value, exclusive: true, onChange: (e, val) => {
                                const selected = colorOptions.find((item) => item.value === val) || {
                                    value: "Yellow",
                                    main: "#f5bd1f",
                                    dark: "#ffc100",
                                };
                                setSettings(Object.assign(Object.assign({}, settings), { secondaryColor: {
                                        main: selected.main,
                                        dark: selected.dark,
                                    } }));
                            } }, { children: colorOptions.map((item) => (_jsx(ToggleButton, Object.assign({ disableRipple: true, disableTouchRipple: true, disableFocusRipple: true, sx: { color: `${item.main} !important` }, value: item.value }, { children: item.value }), item.value))) }))] }))] })) })));
}
//# sourceMappingURL=settings.js.map