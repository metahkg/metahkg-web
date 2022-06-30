import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FileUpload } from "@mui/icons-material";
import { api } from "../../lib/api";
const Input = styled("input")({
    display: "none",
});
/**
 * It's a form that uploads an image to the server
 * @returns A form with a file input.
 */
export default function UploadAvatar(props) {
    const { onUpload, onSuccess, onError } = props;
    return (_jsx(Box, { children: _jsx("form", Object.assign({ name: "avatar", id: "avatar", encType: "multipart/form-data" }, { children: _jsxs("label", Object.assign({ htmlFor: "contained-button-file" }, { children: [_jsx(Input, { accept: "image/*", id: "contained-button-file", type: "file", name: "avatar", onChange: (e) => {
                            var _a, _b;
                            onUpload && onUpload();
                            const avatar = (_b = (_a = e === null || e === void 0 ? void 0 : e.target) === null || _a === void 0 ? void 0 : _a.files) === null || _b === void 0 ? void 0 : _b[0];
                            avatar &&
                                api.users
                                    .uploadAvatar({ avatar })
                                    .then(onSuccess)
                                    .catch(onError);
                        } }), _jsxs(Button, Object.assign({ className: "mt5 notexttransform", variant: "contained", component: "span" }, { children: [_jsx(FileUpload, { className: "mr5" }), _jsx(Typography, Object.assign({ sx: { color: "secondary.main" } }, { children: "Upload" }))] }))] })) })) }));
}
//# sourceMappingURL=uploadavatar.js.map