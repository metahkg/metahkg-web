import { useNavigate } from "react-router-dom";
import { api } from "../../../lib/api";
import { threadType } from "../../../types/conversation/thread";
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
    return () => {
        if (thread) {
            setUpdating(true);
            const openNewPage = !(thread.conversation.length % 25);

            api.get(
                `/posts/thread/${threadId}?page=${
                    openNewPage ? finalPage + 1 : finalPage
                }${
                    openNewPage
                        ? ""
                        : `&start=${
                              thread.conversation[thread.conversation.length - 1].id + 1
                          }`
                }`
            ).then((res: { data: threadType }) => {
                if (!res.data.conversation.length) {
                    setEnd(true);
                    setUpdating(false);
                    return;
                }
                if (!openNewPage) {
                    lastHeight.current = 0;
                    const conversation = [...thread.conversation, ...res.data.conversation];
                    setThread({
                        ...thread,
                        ...res.data,
                        conversation
                    });
                    setTimeout(() => {
                        document
                            .getElementById(`c${res.data?.conversation[0]?.id}`)
                            ?.scrollIntoView({behavior: "smooth"});
                    });
                    conversation.length % 25 && setEnd(true);
                } else {
                    setThread({
                        ...thread,
                        ...res.data,
                        conversation: [...thread.conversation, ...res.data.conversation],
                    });
                    console.log([...thread.conversation, ...res.data.conversation])
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
