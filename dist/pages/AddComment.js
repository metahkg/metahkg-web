import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./css/addcomment.css";
import { useEffect, useState } from "react";
import { Alert, Box, Button, Tooltip } from "@mui/material";
import { AddComment as AddCommentIcon } from "@mui/icons-material";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import ReactDOMServer from "react-dom/server";
import { useNotification, useUser, useIsSmallScreen, useWidth, } from "../components/ContextProvider";
import { useData, useMenu } from "../components/MenuProvider";
import TextEditor from "../components/texteditor";
import { reCaptchaSiteKey, roundup, setTitle, wholePath } from "../lib/common";
import MetahkgLogo from "../components/logo";
import queryString from "query-string";
import ReCAPTCHA from "react-google-recaptcha";
import UploadImage from "../components/conversation/uploadimage";
import { api } from "../lib/api";
import RenderComment from "../components/renderComment";
import { parseError } from "../lib/parseError";
/**
 * This page is used to add a comment to a thread
 */
export default function AddComment() {
    setTitle("Comment | Metahkg");
    const navigate = useNavigate();
    const [menu, setMenu] = useMenu();
    const [data, setData] = useData();
    const isSmallScreen = useIsSmallScreen();
    const [width] = useWidth();
    const [comment, setComment] = useState("");
    const [imgUrl, setImgUrl] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [rtoken, setRtoken] = useState("");
    const [initText, setInitText] = useState("");
    const [alert, setAlert] = useState({
        severity: "info",
        text: "",
    });
    const [, setNotification] = useNotification();
    const [user] = useUser();
    const query = queryString.parse(window.location.search);
    const edit = Number(query.edit);
    const quote = Number(query.quote);
    const params = useParams();
    const id = Number(params.id);
    useEffect(() => {
        if (user) {
            api.threads.checkExist({ threadId: id }).catch((err) => {
                if (err.response.status === 404) {
                    setAlert({
                        severity: "warning",
                        text: "Thread not found. Redirecting you to the homepage in 5 seconds.",
                    });
                    setNotification({
                        open: true,
                        text: "Thread not found. Redirecting you to the homepage in 5 seconds.",
                    });
                    setTimeout(() => {
                        navigate("/", { replace: true });
                    }, 5000);
                }
                else {
                    setAlert({
                        severity: "error",
                        text: parseError(err),
                    });
                    setNotification({
                        open: true,
                        text: parseError(err),
                    });
                }
            });
            edit &&
                api.threads.comments
                    .get({ threadId: id, commentId: edit })
                    .then((res) => {
                    setInitText(`<blockquote style="color: #aca9a9; border-left: 2px solid #646262; margin-left: 0"><div style="margin-left: 15px">${ReactDOMServer.renderToStaticMarkup(_jsx(RenderComment, { comment: res.data, depth: 0 }))}</div></blockquote><p></p>`);
                    setAlert({ severity: "info", text: "" });
                    setTimeout(() => {
                        setNotification({ open: false, text: "" });
                    }, 500);
                })
                    .catch(() => {
                    setAlert({
                        severity: "warning",
                        text: "Unable to fetch comment. This comment would not be a quote.",
                    });
                    setNotification({
                        open: true,
                        text: "Unable to fetch comment. This comment would not be a quote.",
                    });
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    /**
     * It sends a post request to the server with the comment data.
     */
    function addComment() {
        setDisabled(true);
        setAlert({ severity: "info", text: "Adding comment..." });
        setNotification({ open: true, text: "Adding comment..." });
        api.threads.comments
            .add({
            threadId: id,
            comment,
            rtoken,
            quote,
        })
            .then((res) => {
            data.length && setData([]);
            navigate(`/thread/${id}?page=${roundup(res.data.id / 25)}&c=${res.data.id}`, { replace: true });
            setTimeout(() => {
                setNotification({ open: false, text: "" });
            }, 100);
        })
            .catch((err) => {
            setAlert({
                severity: "error",
                text: parseError(err),
            });
            setNotification({
                open: true,
                text: parseError(err),
            });
            setDisabled(false);
            setRtoken("");
            grecaptcha.reset();
        });
    }
    /* It checks if the user is logged in. If not, it redirects the user to the login page. */
    if (!user)
        return (_jsx(Navigate, { to: `/users/login?continue=true&returnto=${encodeURIComponent(wholePath())}`, replace: true }));
    menu && setMenu(false);
    const isSmallSmallScreen = width * 0.8 - 40 <= 450;
    return (_jsx(Box, Object.assign({ className: "min-height-fullvh flex justify-center fullwidth align-center", sx: {
            bgcolor: "primary.dark",
        } }, { children: _jsx("div", Object.assign({ style: { width: isSmallScreen ? "100vw" : "80vw" } }, { children: _jsxs("div", Object.assign({ className: "m20" }, { children: [_jsxs("div", Object.assign({ className: "flex align-center" }, { children: [_jsx(MetahkgLogo, { svg: true, height: 50, width: 40, light: true, className: "mr10 mb10" }), _jsx("h1", Object.assign({ className: "nomargin" }, { children: "Add comment" }))] })), _jsxs("h4", Object.assign({ className: "mt5 mb10 font-size-22" }, { children: [quote ? "Reply to comment #" : "target: thread ", _jsx(Link, Object.assign({ to: `/thread/${id}${quote && `?c=${quote}`}`, target: "_blank", rel: "noreferrer" }, { children: quote || id }))] })), alert.text && (_jsx(Alert, Object.assign({ className: "mb10", severity: alert.severity }, { children: alert.text }))), _jsxs("div", Object.assign({ className: `${!isSmallScreen ? "flex" : ""} align-center mb15` }, { children: [_jsx(UploadImage, { onUpload: () => {
                                    setAlert({
                                        severity: "info",
                                        text: "Uploading image...",
                                    });
                                    setNotification({
                                        open: true,
                                        text: "Uploading image...",
                                    });
                                }, onSuccess: (res) => {
                                    setAlert({ severity: "info", text: "Image uploaded!" });
                                    setNotification({ open: true, text: "Image uploaded!" });
                                    setTimeout(() => {
                                        setNotification({ open: false, text: "" });
                                    }, 1000);
                                    setImgUrl(res.data.url);
                                    tinymce.activeEditor.insertContent(`<img src="${res.data.url}" width="auto" height="auto" style="object-fit: contain; max-height: 400px; max-width: 100%;" alt=""/>`);
                                }, onError: () => {
                                    setAlert({
                                        severity: "error",
                                        text: "Error uploading image.",
                                    });
                                    setNotification({
                                        open: true,
                                        text: "Error uploading image.",
                                    });
                                } }), imgUrl && (_jsxs("p", Object.assign({ className: `ml10 novmargin flex${isSmallScreen ? " mt5" : ""}` }, { children: [_jsx(Tooltip, Object.assign({ arrow: true, title: _jsx("img", { src: `https://i.metahkg.org/thumbnail?src=${imgUrl}`, alt: "" }) }, { children: _jsx("a", Object.assign({ href: imgUrl, target: "_blank", rel: "noreferrer" }, { children: imgUrl })) })), _jsx("p", Object.assign({ className: "link novmargin metahkg-grey-force ml5", onClick: () => {
                                            navigator.clipboard.writeText(imgUrl);
                                            setNotification({
                                                open: true,
                                                text: "Copied to clipboard!",
                                            });
                                        } }, { children: "copy" }))] })))] })), _jsx(TextEditor, { onChange: (v, e) => {
                            setComment(e.getContent());
                        }, initText: edit ? initText : undefined }, id), _jsxs("div", Object.assign({ className: `mt15 ${isSmallSmallScreen
                            ? ""
                            : "flex fullwidth justify-space-between align-center"}` }, { children: [_jsx(ReCAPTCHA, { theme: "dark", sitekey: reCaptchaSiteKey, onChange: (token) => {
                                    setRtoken(token || "");
                                } }), _jsxs(Button, Object.assign({ disabled: disabled || !comment || !rtoken, className: `${isSmallSmallScreen ? "mt15 " : ""}font-size-16-force notexttransform ac-btn`, onClick: addComment, variant: "contained", color: "secondary" }, { children: [_jsx(AddCommentIcon, { className: "mr5 font-size-16-force" }), "Comment"] }))] }))] })) })) })));
}
//# sourceMappingURL=AddComment.js.map