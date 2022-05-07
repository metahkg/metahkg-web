import { useNavigate } from "react-router-dom";
import { api } from "../../../lib/api";
import { threadType } from "../../../types/conversation/thread";
import { useNotification } from "../../ContextProvider";
import {
    useCurrentPage,
    useEnd,
    useFinalPage,
    useLastHeight,
    useLoading,
    usePages,
    useRerender,
    useThread,
    useThreadId,
} from "../ConversationContext";

export default function useChangePage() {
    const [, setLoading] = useLoading();
    const [, setPages] = usePages();
    const [finalPage, setFinalPage] = useFinalPage();
    const lastHeight = useLastHeight();
    const [, setEnd] = useEnd();
    const [, setReRender] = useRerender();
    const [, setCurrentPage] = useCurrentPage();
    const [, setNotification] = useNotification();
    const [thread, setThread] = useThread();
    const navigate = useNavigate();
    const threadId = useThreadId();

    return (newPage: number) => {
        setFinalPage(newPage);
        setCurrentPage(newPage);

        lastHeight.current = 0;

        navigate(`${window.location.pathname}?page=${newPage}`, { replace: true });

        const targetElement = document.getElementById(`${newPage}`);

        if (targetElement) return targetElement.scrollIntoView({ behavior: "smooth" });

        setLoading(true);
        if (thread) thread.conversation = [];
        setThread(thread);
        setEnd(false);
        setReRender(Math.random());
        setPages(1);

        api.get(`/api/posts/thread/${threadId}?page=${newPage}`).then(
            (res: { data: threadType }) => {
                if (!res.data.conversation.length)
                    return setNotification({ open: true, text: "Page not found!" });

                setThread(res.data);
                res.data.conversation.length % 25 && setEnd(true);
                document.getElementById(String(finalPage))?.scrollIntoView();
            }
        );
    };
}
