import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCat, useData, useId, useProfile, useRecall, useSearch, useSelected, useSmode, } from "../MenuProvider";
import { useHistory, useNotification, useQuery } from "../ContextProvider";
import { api } from "../../lib/api";
import { Box, Divider, Paper, Typography } from "@mui/material";
import MenuThread from "./menuThread";
import MenuPreload from "./menuPreload";
import { parseError } from "../../lib/parseError";
/**
 * This function renders the main content of the menu
 */
export default function MenuBody() {
    const navigate = useNavigate();
    const [category] = useCat();
    const [search] = useSearch();
    const [profile] = useProfile();
    const [selected] = useSelected();
    const [recall] = useRecall();
    const [query] = useQuery();
    const [, setNotification] = useNotification();
    const [id] = useId();
    const [data, setData] = useData();
    const [smode] = useSmode();
    const [page, setPage] = useState(1);
    const [end, setEnd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useHistory();
    const paperRef = useRef(null);
    /**
     * It sets the notification state to an object with the open property set to true and the text
     * property set to the error message.
     * @param {AxiosError} err - The error object.
     */
    function onError(err) {
        var _a, _b;
        setNotification({
            open: true,
            text: parseError(err),
        });
        ((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.status) === 404 && navigate("/404", { replace: true });
        ((_b = err === null || err === void 0 ? void 0 : err.response) === null || _b === void 0 ? void 0 : _b.status) === 403 && navigate("/403", { replace: true });
    }
    const mode = (search && "search") || (profile && "profile") || (recall && "recall") || "menu";
    /* A way to make sure that the effect is only run once. */
    useEffect(() => {
        if (!data.length && (category || profile || (search && query) || id || recall)) {
            setEnd(false);
            setLoading(true);
            const onSuccess = (res) => {
                page !== 1 && setPage(1);
                res.data.length && setData(res.data);
                res.data.length < 25 && setEnd(true);
                setLoading(false);
                setTimeout(() => {
                    if (paperRef.current)
                        paperRef.current.scrollTop = 0;
                });
            };
            switch (mode) {
                case "menu":
                    api.menu
                        .main(Object.assign(Object.assign({}, (category ? { categoryId: category } : { threadId: id })), { sort: selected }))
                        .then(onSuccess)
                        .catch(onError);
                    break;
                case "profile":
                    api.menu
                        .history({ userId: profile, sort: selected })
                        .then(onSuccess)
                        .catch(onError);
                    break;
                case "search":
                    api.menu
                        .search({
                        searchQuery: encodeURIComponent(query),
                        sort: selected,
                    })
                        .then(onSuccess)
                        .catch(onError);
                    break;
                case "recall":
                    api.menu
                        .threads({
                        threads: history.map((item) => item.id).slice(0, 24),
                    })
                        .then(onSuccess)
                        .catch(onError);
                    break;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, recall, profile, data, selected, category]);
    useEffect(() => {
        if (query && search)
            setData([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, search]);
    /**
     * It updates the data array with the new data from the API.
     */
    function update() {
        setEnd(false);
        setLoading(true);
        const onSuccess = (res) => {
            setData([...data, ...res.data]);
            res.data.length < 25 && setEnd(true);
            setPage((page) => page + 1);
            setLoading(false);
        };
        switch (mode) {
            case "menu":
                api.menu
                    .main(Object.assign(Object.assign({}, (category ? { categoryId: category } : { threadId: id })), { sort: selected, page: page + 1 }))
                    .then(onSuccess)
                    .catch(onError);
                break;
            case "profile":
                api.menu
                    .history({
                    userId: profile,
                    sort: selected,
                    page: page + 1,
                })
                    .then(onSuccess)
                    .catch(onError);
                break;
            case "search":
                api.menu
                    .search({
                    searchQuery: encodeURIComponent(query),
                    sort: selected,
                    page: page + 1,
                    mode: smode,
                })
                    .then(onSuccess)
                    .catch(onError);
                break;
            case "recall":
                api.menu
                    .threads({
                    threads: history
                        .map((item) => item.id)
                        .slice(page * 25, (page + 1) * 25 - 1),
                })
                    .then(onSuccess)
                    .catch(onError);
                break;
        }
    }
    /**
     * If the user has scrolled to the bottom of the page, update the list
     * @param {any} e - The event object.
     */
    function onScroll(e) {
        if (!end && !loading) {
            const diff = e.target.scrollHeight - e.target.scrollTop;
            if ((e.target.clientHeight >= diff - 1.5 &&
                e.target.clientHeight <= diff + 1.5) ||
                diff < e.target.clientHeight) {
                update();
            }
        }
    }
    if (search && !query)
        return (_jsx(Typography, Object.assign({ className: "text-align-center mt10", color: "secondary" }, { children: "Please enter a query." })));
    return (_jsx(Paper, Object.assign({ className: "nobgimage noshadow overflow-auto", style: {
            maxHeight: `calc(100vh - ${(search && "151") || (recall && "51") || "91"}px)`,
        }, onScroll: onScroll, ref: paperRef }, { children: _jsxs(Box, Object.assign({ className: "min-height-full menu-bottom flex flex-dir-column" }, { children: [Boolean(data.length) && (_jsx(Box, Object.assign({ className: "flex flex-dir-column max-width-full menu-bottom" }, { children: data.map((thread, index) => (_jsxs("div", { children: [_jsx(MenuThread, { thread: thread, onClick: () => {
                                    const index = history.findIndex((i) => i.id === thread.id);
                                    if (index === -1) {
                                        history.unshift({
                                            id: thread.id,
                                            c: thread.c,
                                            cid: 1,
                                        });
                                        setHistory(history);
                                        localStorage.setItem("history", JSON.stringify(history));
                                    }
                                    else if (history[index].cid < thread.c) {
                                        history[index].c = thread.c;
                                        setHistory(history);
                                        localStorage.setItem("history", JSON.stringify(history));
                                    }
                                } }, `${category}${id === thread.id}`), _jsx(Divider, {})] }, index))) }))), loading && _jsx(MenuPreload, {}), end && (_jsx(Typography, Object.assign({ className: "mt10 mb10 text-align-center font-size-20-force", sx: {
                        color: "secondary.main",
                    } }, { children: "End" })))] })) })));
}
//# sourceMappingURL=menuBody.js.map