import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Close, Comment as CommentIcon } from "@mui/icons-material";
import { Alert, Box, Button, CircularProgress, DialogTitle, IconButton, Snackbar, Tooltip, } from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";
import { api } from "../lib/api";
import Comment from "./conversation/comment";
import { useEditor, useFinalPage, useThread, useThreadId, } from "./conversation/ConversationContext";
import { useUpdate } from "./conversation/functions/update";
import TextEditor from "./texteditor";
import { useIsSmallScreen, useNotification } from "./ContextProvider";
import UploadImage from "./conversation/uploadimage";
import useChangePage from "./conversation/functions/changePage";
import { reCaptchaSiteKey, roundup } from "../lib/common";
import { parseError } from "../lib/parseError";
export default function FloatingEditor() {
    const threadId = useThreadId();
    const [editor, setEditor] = useEditor();
    const [comment, setComment] = useState("");
    const [rtoken, setRtoken] = useState("");
    const [creating, setCreating] = useState(false);
    const [fold, setFold] = useState(false);
    const [, setNotification] = useNotification();
    const [thread] = useThread();
    const [imgUrl, setImgUrl] = useState("");
    const [alert, setAlert] = useState({
        severity: "info",
        text: "",
    });
    const isSmallScreen = useIsSmallScreen();
    const update = useUpdate();
    const changePage = useChangePage();
    const [finalPage] = useFinalPage();
    const [shouldUpdate, setShouldUpdate] = useState(false);
    const [newCommentId, setNewCommentId] = useState(0);
    useEffect(() => {
        if (shouldUpdate && newCommentId) {
            setShouldUpdate(false);
            setNewCommentId(0);
            update({ scrollToComment: newCommentId });
        }
    }, [newCommentId, shouldUpdate, update]);
    function clearState() {
        setComment("");
        setImgUrl("");
        setAlert({ severity: "info", text: "" });
        setRtoken("");
        setCreating(false);
        setFold(false);
    }
    const handleClose = () => {
        setEditor(Object.assign(Object.assign({}, editor), { open: false }));
        clearState();
    };
    function CreateComment() {
        var _a;
        setCreating(true);
        api.threads.comments
            .add({
            threadId,
            comment,
            quote: (_a = editor.quote) === null || _a === void 0 ? void 0 : _a.id,
            rtoken,
        })
            .then((res) => {
            setNewCommentId(res.data.id);
            const numOfPages = roundup((res.data.id || 0) / 25);
            setEditor(Object.assign(Object.assign({}, editor), { open: false }));
            if (numOfPages !== finalPage)
                changePage(numOfPages, () => {
                    setShouldUpdate(true);
                });
            else
                update({ scrollToComment: res.data.id });
            setCreating(false);
            clearState();
        })
            .catch((err) => {
            setNotification({
                open: true,
                text: parseError(err),
            });
            setCreating(false);
            grecaptcha.reset();
        });
    }
    return (_jsx(Snackbar, Object.assign({ sx: { zIndex: 1000, top: `${(thread === null || thread === void 0 ? void 0 : thread.pin) ? "110" : "60"}px !important` }, className: "border-radius-20", anchorOrigin: { horizontal: "right", vertical: "top" }, open: editor.open }, { children: _jsxs(Box, Object.assign({ sx: {
                maxWidth: isSmallScreen ? "100vw" : "70vw",
                width: isSmallScreen ? "100vw" : "50vw",
                maxHeight: "70vh",
                bgcolor: "primary.dark",
                overflow: "auto",
            }, className: "border-radius-15" }, { children: [_jsxs(DialogTitle, Object.assign({ className: "flex justify-space-between align-center nopadding" }, { children: [_jsx("p", Object.assign({ className: "ml20 mt10 mb10" }, { children: editor.quote ? "Reply" : "Comment" })), _jsxs(Box, Object.assign({ className: "flex" }, { children: [_jsx("p", Object.assign({ className: "novmargin pointer mr10 metahkg-yellow", onClick: () => {
                                        setFold(!fold);
                                    } }, { children: fold ? "Expand" : "Fold" })), _jsx(IconButton, Object.assign({ className: "mr5", onClick: handleClose }, { children: _jsx(Close, { className: "font-size-18-force" }) }))] }))] })), _jsxs(Box, Object.assign({ className: `border-radius-20 ${fold ? "display-none" : ""}` }, { children: [editor.quote && (_jsx(Comment, { comment: editor.quote, fold: true, noId: true, fetchComment: true, noStory: true, noQuote: true })), _jsx(UploadImage, { className: "m10", onUpload: () => {
                                setAlert({
                                    severity: "info",
                                    text: "Uploading image...",
                                });
                            }, onSuccess: (res) => {
                                setAlert({ severity: "info", text: "Image uploaded!" });
                                setImgUrl(res.data.url);
                                tinymce.activeEditor.insertContent(`<img src="${res.data.url}" width="auto" height="auto" style="object-fit: contain; max-height: 400px; max-width: 100%;" alt="" />`);
                            }, onError: () => {
                                setAlert({
                                    severity: "error",
                                    text: "Error uploading image.",
                                });
                            } }), imgUrl && (_jsxs("p", Object.assign({ className: `ml10 novmargin flex${isSmallScreen ? " mt5" : ""}` }, { children: [_jsx(Tooltip, Object.assign({ arrow: true, title: _jsx("img", { src: `https://i.metahkg.org/thumbnail?src=${imgUrl}`, alt: "" }) }, { children: _jsx("a", Object.assign({ href: imgUrl, target: "_blank", rel: "noreferrer" }, { children: imgUrl })) })), _jsx("p", Object.assign({ className: "link novmargin metahkg-grey-force ml5", onClick: () => {
                                        navigator.clipboard.writeText(imgUrl);
                                        setNotification({
                                            open: true,
                                            text: "Copied to clipboard!",
                                        });
                                    } }, { children: "copy" }))] }))), alert.text && (_jsx(Alert, Object.assign({ className: "m10", severity: alert.severity }, { children: alert.text }))), _jsx(TextEditor, { onChange: (e) => {
                                setComment(e);
                            }, autoresize: true, className: "ml10 mr10" }), _jsxs(Box, Object.assign({ className: `${isSmallScreen ? "" : "flex"} justify-space-between align-center m10` }, { children: [_jsx(ReCAPTCHA, { theme: "dark", sitekey: reCaptchaSiteKey, onChange: (token) => {
                                        setRtoken(token || "");
                                    } }), creating ? (_jsx(CircularProgress, { color: "secondary", disableShrink: true })) : (_jsxs(Button, Object.assign({ variant: "contained", color: "secondary", onClick: CreateComment, disabled: !rtoken || !comment, className: isSmallScreen ? "mt10" : "" }, { children: [_jsx(CommentIcon, {}), "Comment"] })))] }))] }))] })) })));
}
//# sourceMappingURL=floatingEditor.js.map