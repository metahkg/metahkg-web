import { useHistory } from "../../ContextProvider";
import { useEnd, useThread, useThreadId, useUpdating } from "../ConversationContext";
import { useUpdate } from "./update";

export default function useOnScroll() {
    const [end] = useEnd();
    const [updating] = useUpdating();
    const [history, setHistory] = useHistory();
    const [thread] = useThread();
    const threadId = useThreadId();
    const update = useUpdate();
    return (e: any) => {
        if (!end && !updating) {
            const diff = e.target.scrollHeight - e.target.scrollTop;
            if (
                (e.target.clientHeight >= diff - 1.5 &&
                    e.target.clientHeight <= diff + 1.5) ||
                diff < e.target.clientHeight
            ) {
                update();
            }
        }
        const index = history.findIndex((i) => i.id === threadId);
        if (index !== -1 && thread) {
            const arr = thread.conversation.map((comment) => {
                return {
                    top: Math.abs(
                        Number(
                            document
                                .getElementById(`c${comment.id}`)
                                ?.getBoundingClientRect()?.top
                        )
                    ),
                    id: comment.id,
                };
            });
            const min = Math.min.apply(
                Math,
                arr.filter((i) => Boolean(i.top)).map((i) => i.top)
            );
            const currentComment = arr.find((i) => i.top === min)?.id;
            if (history[index]?.cid !== currentComment && currentComment) {
                history[index].cid = currentComment;
                setHistory(history);
                localStorage.setItem("history", JSON.stringify(history));
            }
        }
    };
}
