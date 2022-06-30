import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { FileUpload } from "@mui/icons-material";
const Input = styled("input")({
    display: "none",
});
/**
 * It's a form that uploads an image to the server
 * @returns A form with a file input.
 */
export default function UploadImage(props) {
    const { className, onUpload, onSuccess, onError } = props;
    return (_jsx(Box, Object.assign({ className: className }, { children: _jsx("form", Object.assign({ name: "image", encType: "multipart/form-data" }, { children: _jsxs("label", Object.assign({ htmlFor: "upload-image" }, { children: [_jsx(Input, { accept: "image/*", id: "upload-image", type: "file", name: "image", onChange: (e) => {
                            var _a;
                            onUpload && onUpload();
                            const formData = new FormData();
                            formData.append("image", ((_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0]) || "");
                            axios
                                .post("https://api.na.cx/upload", formData, {
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                },
                            })
                                .then(onSuccess)
                                .catch(onError);
                        } }), _jsxs(Button, Object.assign({ className: "notexttransform", variant: "contained", component: "span" }, { children: [_jsx(FileUpload, { className: "mr5" }), _jsx(Typography, Object.assign({ sx: { color: "secondary.main" } }, { children: "Upload Image" }))] }))] })) })) })));
}
//# sourceMappingURL=uploadimage.js.map