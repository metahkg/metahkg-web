import { useNavigate } from "react-router-dom";
import { api } from "../../../lib/api";
import { useNotification } from "../../ContextProvider";
import { useCurrentPage, useEnd, useFinalPage, useLastHeight, useLoading, usePages, useRerender, useThread, useThreadId, } from "../ConversationContext";
import { roundup } from "../../../lib/common";
import { parseError } from "../../../lib/parseError";
export default function useChangePage() {
    var _a, _b;
    const [, setLoading] = useLoading();
    const [pages, setPages] = usePages();
    const [finalPage, setFinalPage] = useFinalPage();
    const lastHeight = useLastHeight();
    const [, setEnd] = useEnd();
    const [, setReRender] = useRerender();
    const [, setCurrentPage] = useCurrentPage();
    const [, setNotification] = useNotification();
    const [thread, setThread] = useThread();
    const navigate = useNavigate();
    const threadId = useThreadId();
    const firstPage = roundup((((_b = (_a = thread === null || thread === void 0 ? void 0 : thread.conversation) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.id) || 1) / 25);
    return (newPage, callback) => {
        if (thread) {
            setCurrentPage(newPage);
            lastHeight.current = 0;
            navigate(`${window.location.pathname}?page=${newPage}`, { replace: true });
            const targetElement = document.getElementById(`${newPage}`);
            if (targetElement)
                return targetElement.scrollIntoView({ behavior: "smooth" });
            const shouldReRender = newPage - finalPage !== 1 && newPage - firstPage !== -1;
            if (shouldReRender) {
                if (thread)
                    thread.conversation = [];
                setThread(thread);
                setReRender((reRender) => !reRender);
            }
            setLoading(true);
            setEnd(false);
            setPages(shouldReRender ? 1 : pages + 1);
            setFinalPage(shouldReRender || newPage - finalPage === 1 ? newPage : finalPage);
            api.threads
                .get({ threadId, page: newPage })
                .then((res) => {
                var _a;
                if (!res.data.conversation.length)
                    return setNotification({ open: true, text: "Page not found!" });
                setThread(shouldReRender
                    ? res.data
                    : Object.assign(Object.assign(Object.assign({}, thread), res.data), { conversation: newPage - finalPage === 1
                            ? [
                                ...thread.conversation,
                                ...res.data.conversation,
                            ]
                            : [
                                ...res.data.conversation,
                                ...thread.conversation,
                            ] }));
                res.data.conversation.length % 25 && setEnd(true);
                (_a = document
                    .getElementById(String(newPage))) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
                callback && setTimeout(callback);
            })
                .catch((err) => {
                setNotification({
                    open: true,
                    text: parseError(err),
                });
            });
        }
    };
}
//# sourceMappingURL=changePage.js.map