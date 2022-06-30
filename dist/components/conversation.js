import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./css/conversation.css";
import "react-photo-view/dist/react-photo-view.css";
import React, { memo, useEffect } from "react";
import { Box, Button, CircularProgress, LinearProgress, Paper, } from "@mui/material";
import queryString from "query-string";
import loadable from "@loadable/component";
import Title from "./conversation/title";
import { roundup } from "../lib/common";
import { useNavigate } from "react-router-dom";
import PageTop from "./conversation/pagetop";
import VisibilityDetector from "react-visibility-detector";
import { useHistory, useIsSmallScreen, useUser } from "./ContextProvider";
import PageBottom from "./conversation/pagebottom";
import PageSelect from "./conversation/pageselect";
import useBtns from "./conversation/functions/btns";
import { PhotoProvider } from "react-photo-view";
import { useCBottom, useCRoot, useCurrentPage, useEnd, useFinalPage, useGalleryOpen, useImages, useLoading, usePages, useRerender, useStory, useThread, useUpdating, useUserVotes, } from "./conversation/ConversationContext";
import { useUpdate } from "./conversation/functions/update";
import useFirstFetch from "./conversation/functions/firstfetch";
import useChangePage from "./conversation/functions/changePage";
import useOnScroll from "./conversation/functions/onScroll";
import useOnVisibilityChange from "./conversation/functions/onVisibilityChange";
import FloatingEditor from "./floatingEditor";
import Comment from "./conversation/comment";
const PinnedComment = loadable(() => import("./conversation/pin"));
const Share = loadable(() => import("./conversation/share"));
const Gallery = loadable(() => import("./conversation/gallery"));
const Dock = loadable(() => import("./dock"));
function Conversation(props) {
    const query = queryString.parse(window.location.search);
    const [thread] = useThread();
    const [finalPage] = useFinalPage();
    /** Current page */
    const [currentPage, setCurrentPage] = useCurrentPage();
    const [userVotes] = useUserVotes();
    const [updating] = useUpdating();
    const [pages] = usePages();
    const [, setEnd] = useEnd();
    const [loading, setLoading] = useLoading();
    const [reRender] = useRerender();
    const isSmallScreen = useIsSmallScreen();
    const [story] = useStory();
    const [galleryOpen, setGalleryOpen] = useGalleryOpen();
    const [images] = useImages();
    const [history, setHistory] = useHistory();
    const [user] = useUser();
    const cRoot = useCRoot();
    const cBottom = useCBottom();
    const navigate = useNavigate();
    /* Checking if the error is a 404 error and if it is, it will navigate to the 404 page. */
    useFirstFetch();
    useEffect(() => {
        if (history.findIndex((i) => i.id === props.id) === -1) {
            history.push({ id: props.id, cid: 1, c: 1 });
            setHistory(history);
            localStorage.setItem("history", JSON.stringify(history));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    /**
     * It fetches new comments, or the next page (if last comment id % 25 = 0)
     * of messages from the server and appends them to the conversation array
     */
    const update = useUpdate();
    const changePage = useChangePage();
    const onScroll = useOnScroll();
    const ready = !!(thread && thread.conversation.length && (user ? userVotes : 1));
    useEffect(() => {
        !query.page &&
            !query.c &&
            navigate(`${window.location.pathname}?page=1`, { replace: true });
        if (ready) {
            if (loading)
                setTimeout(() => {
                    loading && setLoading(false);
                }, 100);
            if (query.c) {
                navigate(`${window.location.pathname}?page=${finalPage}`, {
                    replace: true,
                });
                setCurrentPage(finalPage);
            }
        }
    }, [
        ready,
        loading,
        navigate,
        query.c,
        finalPage,
        setCurrentPage,
        query.page,
        setLoading,
    ]);
    const numOfPages = roundup(((thread === null || thread === void 0 ? void 0 : thread.c) || 0) / 25);
    const btns = useBtns();
    const onVisibilityChange = useOnVisibilityChange();
    return (_jsx(Box, Object.assign({ className: "min-height-fullvh conversation-root", sx: (theme) => ({
            "& *::selection": {
                background: theme.palette.secondary.main,
                color: "black",
            },
        }) }, { children: _jsxs(PhotoProvider, { children: [_jsx(FloatingEditor, {}), _jsx(Gallery, { open: galleryOpen, setOpen: setGalleryOpen, images: images }), _jsx(Dock, { btns: btns }), _jsx(Share, {}), !isSmallScreen && (_jsx(PageSelect, { last: currentPage !== 1 && numOfPages > 1, next: currentPage !== numOfPages && numOfPages > 1, pages: numOfPages, page: currentPage, onLastClicked: () => {
                        changePage(currentPage - 1);
                    }, onNextClicked: () => {
                        changePage(currentPage + 1);
                    }, onSelect: (e) => {
                        changePage(Number(e.target.value));
                    } })), loading && _jsx(LinearProgress, { className: "fullwidth", color: "secondary" }), _jsx(Title, { category: thread === null || thread === void 0 ? void 0 : thread.category, title: thread === null || thread === void 0 ? void 0 : thread.title, btns: btns }), (thread === null || thread === void 0 ? void 0 : thread.pin) && _jsx(PinnedComment, { comment: thread === null || thread === void 0 ? void 0 : thread.pin }), _jsxs(Paper, Object.assign({ ref: cRoot, className: `overflow-auto nobgimage noshadow conversation-paper${(thread === null || thread === void 0 ? void 0 : thread.pin) ? "-pin" : ""}${loading ? "-loading" : ""}`, sx: { bgcolor: "primary.dark" }, onScroll: onScroll }, { children: [_jsx(Box, Object.assign({ className: "fullwidth max-height-full max-width-full" }, { children: ready &&
                                [...Array(pages)].map((p, index) => {
                                    const page = roundup(thread.conversation[0].id / 25) + index;
                                    return (_jsxs(Box, { children: [_jsx(VisibilityDetector, Object.assign({ onVisibilityChange: (isVisible) => {
                                                    onVisibilityChange(isVisible, page);
                                                } }, { children: _jsx(PageTop, { id: page, pages: numOfPages, page: page, onChange: (e) => {
                                                        changePage(Number(e.target.value));
                                                    }, last: !(page === 1 && !index), next: page !== numOfPages, onLastClicked: () => {
                                                        changePage(page - 1);
                                                    }, onNextClicked: () => {
                                                        changePage(page + 1);
                                                    } }) })), _jsx(React.Fragment, { children: thread.conversation
                                                    .slice(index * 25, (index + 1) * 25 - 1)
                                                    .map((comment) => !(comment === null || comment === void 0 ? void 0 : comment.removed) &&
                                                    (story
                                                        ? story === (comment === null || comment === void 0 ? void 0 : comment.user.id)
                                                        : 1) && (_jsx(Comment, { comment: comment, scrollIntoView: Number(query.c) ===
                                                        comment.id }, comment.id))) })] }, index));
                                }) })), _jsx(Box, Object.assign({ ref: cBottom, className: "flex justify-center align-center conversation-bottom", sx: {
                                bgcolor: "primary.dark",
                            } }, { children: !updating ? (_jsx(Button, Object.assign({ variant: "outlined", color: "secondary", onClick: () => {
                                    setEnd(false);
                                    update();
                                } }, { children: "Update" }))) : (_jsx(CircularProgress, { disableShrink: true, color: "secondary" })) })), _jsx(PageBottom, {})] }), Number(reRender))] }) })));
}
export default memo(Conversation);
//# sourceMappingURL=conversation.js.map