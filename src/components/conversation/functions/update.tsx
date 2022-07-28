import { useNavigate } from "react-router-dom";
import { api } from "../../../lib/api";
import {
    useCurrentPage,
    useEnd,
    useFinalPage,
    useLastHeight,
    usePages,
    useThread,
    useThreadId,
    useUpdating,
} from "../ConversationContext";

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

    return (options?: { scrollToBottom?: boolean; scrollToComment?: number }) => {
        if (thread) {
            setUpdating(true);
            const openNewPage = !(thread.conversation.length % 25);

            api.thread(
                threadId,
                openNewPage ? finalPage + 1 : finalPage,
                undefined,
                undefined,
                openNewPage
                    ? undefined
                    : thread.conversation[thread.conversation.length - 1].id + 1
            ).then((data) => {
                const scroll = () => {
                    document
                        .getElementById(
                            `c${
                                options?.scrollToComment ||
                                data?.conversation[
                                    options?.scrollToBottom
                                        ? data?.conversation?.length - 1
                                        : 0
                                ]?.id
                            }`
                        )
                        ?.scrollIntoView({ behavior: "smooth" });
                };
                if (!data.conversation.length) {
                    setEnd(true);
                    setUpdating(false);
                    if (options?.scrollToBottom || options?.scrollToComment)
                        setTimeout(scroll, 1);
                    return;
                }
                if (!openNewPage) {
                    lastHeight.current = 0;
                    const conversation = [
                        ...thread.conversation,
                        ...data.conversation,
                    ];
                    setThread({
                        ...thread,
                        ...data,
                        conversation,
                    });
                    setTimeout(scroll, 1);
                    conversation.length % 25 && setEnd(true);
                } else {
                    setThread({
                        ...thread,
                        ...data,
                        conversation: [...thread.conversation, ...data.conversation],
                    });
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
