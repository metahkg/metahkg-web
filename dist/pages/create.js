import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./css/create.css";
import { useEffect, useState } from "react";
import { Alert, Box, Button, TextField, Tooltip } from "@mui/material";
import { Create as CreateIcon } from "@mui/icons-material";
import TextEditor from "../components/texteditor";
import ReCAPTCHA from "react-google-recaptcha";
import { Navigate, useNavigate } from "react-router-dom";
import queryString from "query-string";
import { useCat, useData, useMenu, useProfile, useRecall, useSearch, useMenuTitle, } from "../components/MenuProvider";
import { useIsSmallScreen, useNotification, useUser, useWidth, } from "../components/ContextProvider";
import { reCaptchaSiteKey, setTitle, wholePath } from "../lib/common";
import MetahkgLogo from "../components/logo";
import UploadImage from "../components/conversation/uploadimage";
import { api } from "../lib/api";
import ChooseCat from "../components/create/ChooseCat";
import { parseError } from "../lib/parseError";
/**
 * Page for creating a new thread
 */
export default function Create() {
    setTitle("Create thread | Metahkg");
    const navigate = useNavigate();
    const query = queryString.parse(window.location.search);
    const [menu, setMenu] = useMenu();
    const isSmallScreen = useIsSmallScreen();
    const [width] = useWidth();
    const [profile, setProfile] = useProfile();
    const [cat, setCat] = useCat();
    const [search, setSearch] = useSearch();
    const [recall, setRecall] = useRecall();
    const [data, setData] = useData();
    const [mtitle, setMtitle] = useMenuTitle();
    const [, setNotification] = useNotification();
    const [catchoosed, setCatchoosed] = useState(cat || 1);
    const [rtoken, setRtoken] = useState(""); //recaptcha token
    const [postTitle, setPostTitle] = useState(""); //this will be the post title
    const [imgurl, setImgurl] = useState("");
    const [comment, setComment] = useState(""); //initial comment (#1)
    const [disabled, setDisabled] = useState(false);
    const [alert, setAlert] = useState({
        severity: "info",
        text: "",
    });
    const quote = {
        threadId: Number(String(query.quote).split(".")[0]),
        commentId: Number(String(query.quote).split(".")[1]),
    };
    const [inittext, setInittext] = useState("");
    const [user] = useUser();
    useEffect(() => {
        if (user && quote.threadId && quote.commentId) {
            setAlert({ severity: "info", text: "Fetching comment..." });
            setNotification({ open: true, text: "Fetching comment..." });
            api.threads.comments
                .get({ threadId: quote.threadId, commentId: quote.commentId })
                .then((res) => {
                if (res.data) {
                    setInittext(`<blockquote style="color: #aca9a9; border-left: 2px solid #646262; margin-left: 0"><div style="margin-left: 15px">${res.data}</div></blockquote><p></p>`);
                    setAlert({ severity: "info", text: "" });
                    setTimeout(() => {
                        setNotification({ open: false, text: "" });
                    }, 1000);
                }
                else {
                    setAlert({ severity: "error", text: "Comment not found!" });
                    setNotification({ open: true, text: "Comment not found!" });
                }
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
    }, [quote.commentId, quote.threadId, setNotification, user]);
    function create() {
        setAlert({ severity: "info", text: "Creating thread..." });
        setNotification({ open: true, text: "Creating thread..." });
        setDisabled(true);
        api.threads
            .create({
            title: postTitle,
            category: catchoosed,
            comment: comment,
            rtoken: rtoken,
        })
            .then((res) => {
            cat && setCat(0);
            search && setSearch(false);
            recall && setRecall(false);
            profile && setProfile(0);
            data.length && setData([]);
            mtitle && setMtitle("");
            navigate(`/thread/${res.data.id}`, { replace: true });
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
    menu && setMenu(false);
    if (!user)
        return (_jsx(Navigate, { to: `/users/login?continue=true&returnto=${encodeURIComponent(wholePath())}`, replace: true }));
    const isSmallSmallScreen = width * 0.8 - 40 <= 450;
    return (_jsx(Box, Object.assign({ className: "flex fullwidth min-height-fullvh justify-center max-width-full", sx: {
            backgroundColor: "primary.dark",
        } }, { children: _jsx("div", Object.assign({ style: { width: isSmallSmallScreen ? "100vw" : "80vw" } }, { children: _jsxs("div", Object.assign({ className: "m20" }, { children: [_jsxs("div", Object.assign({ className: "flex align-center" }, { children: [_jsx(MetahkgLogo, { svg: true, height: 50, width: 40, light: true, className: "mr10 mb10" }), _jsx("h1", { children: "Create thread" })] })), alert.text && (_jsx(Alert, Object.assign({ className: "mb15", severity: alert.severity }, { children: alert.text }))), _jsxs("div", Object.assign({ className: isSmallScreen ? "" : "flex " }, { children: [_jsx(ChooseCat, { cat: catchoosed, setCat: setCatchoosed }), _jsx(TextField, { className: isSmallScreen ? "mt15" : "ml15", variant: "filled", color: "secondary", fullWidth: true, label: "Title", onChange: (e) => {
                                    setPostTitle(e.target.value);
                                } })] })), _jsxs("div", Object.assign({ className: `${!isSmallScreen ? "flex" : ""} align-center mb15 mt15` }, { children: [_jsx(UploadImage, { onUpload: () => {
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
                                    setImgurl(res.data.url);
                                    tinymce.activeEditor.insertContent(`<a href="${res.data.url}" target="_blank" rel="noreferrer">
                                                <img
                                                    alt=""
                                                    src="${res.data.url}"
                                                    width="auto"
                                                    height="auto"
                                                    style="object-fit: contain; max-height: 400px; max-width: 100%;"
                                                />
                                            </a>`);
                                }, onError: () => {
                                    setAlert({
                                        severity: "error",
                                        text: "Error uploading image.",
                                    });
                                    setNotification({
                                        open: true,
                                        text: "Error uploading image.",
                                    });
                                } }), imgurl && (_jsxs("p", Object.assign({ className: `ml10 novmargin flex${isSmallScreen ? " mt5" : ""}` }, { children: [_jsx(Tooltip, Object.assign({ arrow: true, title: _jsx("img", { src: `https://i.metahkg.org/thumbnail?src=${imgurl}`, alt: "" }) }, { children: _jsx("a", Object.assign({ href: imgurl, target: "_blank", rel: "noreferrer" }, { children: imgurl })) })), _jsx("p", Object.assign({ className: "link novmargin metahkg-grey-force ml5", onClick: () => {
                                            navigator.clipboard.writeText(imgurl);
                                            setNotification({
                                                open: true,
                                                text: "Copied to clipboard!",
                                            });
                                        } }, { children: "copy" }))] })))] })), _jsx(TextEditor, { onChange: (v, e) => {
                            setComment(e.getContent());
                        }, initText: inittext }), _jsxs("div", Object.assign({ className: `mt15 ${isSmallSmallScreen
                            ? ""
                            : "flex fullwidth justify-space-between align-center"}` }, { children: [_jsx(ReCAPTCHA, { theme: "dark", sitekey: reCaptchaSiteKey, onChange: (token) => {
                                    setRtoken(token || "");
                                } }), _jsxs(Button, Object.assign({ disabled: disabled ||
                                    !(comment && postTitle && rtoken && catchoosed), className: `${isSmallSmallScreen ? "mt15 " : ""}font-size-16-force create-btn novpadding notexttransform`, onClick: create, variant: "contained", color: "secondary" }, { children: [_jsx(CreateIcon, { className: "mr5 font-size-16-force" }), "Create"] }))] }))] })) })) })));
}
//# sourceMappingURL=create.js.map