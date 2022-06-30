import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./css/thread.css";
import { Box, Button } from "@mui/material";
import { Article as ArticleIcon, Comment as CommentIcon, ThumbDown as ThumbDownIcon, ThumbUp as ThumbUpIcon, } from "@mui/icons-material";
import { roundup, timeToWord } from "../../lib/common";
import { Link } from "react-router-dom";
import { useCat, useId, useProfile, useRecall, useSearch } from "../MenuProvider";
import { useCategories, useHistory } from "../ContextProvider";
/**
 * A component that renders a thread in the menu.
 * @param {summary} props.thread thread info
 * @param {() => void | undefined} props.onClick on click event handler
 */
export default function MenuThread(props) {
    var _a, _b;
    const [cat] = useCat();
    const [search] = useSearch();
    const [profile] = useProfile();
    const [recall] = useRecall();
    const [id] = useId();
    const [history] = useHistory();
    const categories = useCategories();
    const { thread, onClick } = props;
    const cid = (_a = history.find((i) => i.id === thread.id)) === null || _a === void 0 ? void 0 : _a.cid;
    return (_jsx(Link, Object.assign({ className: "fullwidth notextdecoration", to: `/thread/${thread.id}?${cid && id !== thread.id ? `c=${cid}` : "page=1"}`, onClick: onClick }, { children: _jsxs(Box, Object.assign({ className: `flex fullwidth flex-dir-column user-select-none menuthread-root${id === thread.id ? "-selected" : ""}` }, { children: [_jsxs("div", Object.assign({ className: "flex fullwidth align-center justify-space-between menuthread-top" }, { children: [_jsxs("div", Object.assign({ style: { display: "flex", alignItems: "center" } }, { children: [_jsx("p", Object.assign({ className: "font-size-16 ml20 metahkg-grey menuthread-op", style: {
                                        color: thread.op.sex === "M" ? "#0277bd" : "red",
                                    } }, { children: thread.op.name })), _jsx("p", Object.assign({ className: "ml5 nomargin metahkg-grey font-size-13 menuthread-toptext" }, { children: timeToWord(thread.lastModified) }))] })), _jsxs("div", Object.assign({ className: "flex align-center" }, { children: [thread.vote >= 0 ? (_jsx(ThumbUpIcon, { className: "metahkg-grey ml5 font-size-13-force menuthread-icons" })) : (_jsx(ThumbDownIcon, { className: "metahkg-grey ml5 font-size-13-force menuthread-icons" })), _jsx("p", Object.assign({ className: "nomargin metahkg-grey font-size-13 menuthread-toptext" }, { children: thread.vote })), _jsx(CommentIcon, { className: "metahkg-grey ml5 font-size-13-force menuthread-icons" }), _jsx("p", Object.assign({ className: "nomargin metahkg-grey font-size-13 menuthread-toptext" }, { children: thread.c })), _jsx(ArticleIcon, { className: "metahkg-grey ml5 font-size-13-force menuthread-icons" }), _jsx("p", Object.assign({ className: "mr10 nomargin metahkg-grey font-size-13 menuthread-toptext" }, { children: String(roundup(thread.c / 25)) }))] }))] })), _jsxs("div", Object.assign({ className: "flex fullwidth mb10 align-center justify-space-between menuthread-bottom" }, { children: [_jsx("p", Object.assign({ className: "ml20 nomargin font-size-16 overflow-hidden text-overflow-ellipsis text-align-left menuthread-title" }, { children: thread.title })), Boolean(cat === 1 || search || profile || recall) && (_jsx(Link, Object.assign({ className: "mr10 notextdecoration", to: `/category/${thread.category}` }, { children: _jsx(Button, Object.assign({ variant: "contained", className: "nomargin nopadding notexttransform menuthread-catbtn" }, { children: _jsx("p", Object.assign({ className: "nomargin font-size-12 menuthread-catname" }, { children: (_b = categories.find((i) => i.id === thread.category)) === null || _b === void 0 ? void 0 : _b.name })) })) })))] }))] })) })));
}
//# sourceMappingURL=menuThread.js.map