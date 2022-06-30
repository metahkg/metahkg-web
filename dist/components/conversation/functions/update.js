import { useNavigate } from "react-router-dom";
import { api } from "../../../lib/api";
import { useCurrentPage, useEnd, useFinalPage, useLastHeight, usePages, useThread, useThreadId, useUpdating, } from "../ConversationContext";
export function useUpdate() {
    const [, setUpdating] = useUpdating();
    const [thread, setThread] = useThread();
    const [finalPage, setFinalPage] = useFinalPage();
    const [, setEnd] = useEnd();
    const [pages, setPages] = usePages();
    const lastHeight = useLastHeight();
    const [, setCurrentPage] = useCurrentPage();
    const navigate = useNavigate();
    const threadId = useThreadId();
    return (options) => {
        if (thread) {
            setUpdating(true);
            const openNewPage = !(thread.conversation.length % 25);
            api.threads
                .get(Object.assign({ threadId, page: openNewPage ? finalPage + 1 : finalPage }, (!openNewPage && {
                start: thread.conversation[thread.conversation.length - 1].id + 1,
            })))
                .then((res) => {
                const scroll = () => {
                    var _a, _b, _c, _d, _e;
                    (_e = document
                        .getElementById(`c${(options === null || options === void 0 ? void 0 : options.scrollToComment) ||
                        ((_d = (_a = res.data) === null || _a === void 0 ? void 0 : _a.conversation[(options === null || options === void 0 ? void 0 : options.scrollToBottom)
                            ? ((_c = (_b = res.data) === null || _b === void 0 ? void 0 : _b.conversation) === null || _c === void 0 ? void 0 : _c.length) - 1
                            : 0]) === null || _d === void 0 ? void 0 : _d.id)}`)) === null || _e === void 0 ? void 0 : _e.scrollIntoView({ behavior: "smooth" });
                };
                if (!res.data.conversation.length) {
                    setEnd(true);
                    setUpdating(false);
                    if ((options === null || options === void 0 ? void 0 : options.scrollToBottom) || (options === null || options === void 0 ? void 0 : options.scrollToComment))
                        setTimeout(scroll, 1);
                    return;
                }
                if (!openNewPage) {
                    lastHeight.current = 0;
                    const conversation = [
                        ...thread.conversation,
                        ...res.data.conversation,
                    ];
                    setThread(Object.assign(Object.assign(Object.assign({}, thread), res.data), { conversation }));
                    setTimeout(scroll, 1);
                    conversation.length % 25 && setEnd(true);
                }
                else {
                    setThread(Object.assign(Object.assign(Object.assign({}, thread), res.data), { conversation: [
                            ...thread.conversation,
                            ...res.data.conversation,
                        ] }));
                    setUpdating(false);
                    setFinalPage(finalPage + 1);
                    setPages(pages + 1);
                    navigate(`/thread/${threadId}?page=${finalPage + 1}`, {
                        replace: true,
                    });
                    setCurrentPage(finalPage + 1);
                }
                setUpdating(false);
            });
        }
    };
}
//# sourceMappingURL=update.js.map