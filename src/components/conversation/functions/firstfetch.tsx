import { useEffect } from "react";
import { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../lib/api";
import { useHistory, useNotification, useUser } from "../../AppContextProvider";
import { useCat, useId, useMenuMode } from "../../MenuProvider";
import {
    useEnd,
    useFinalPage,
    useThread,
    useVotes,
    useRerender,
} from "../ConversationContext";
import { setDescription, setTitle } from "../../../lib/common";
import queryString from "query-string";
import { parseError } from "../../../lib/parseError";
import { Comment } from "@metahkg/api";

export default function useFirstFetch() {
    const [finalPage] = useFinalPage();
    const [, setThread] = useThread();
    const [history, setHistory] = useHistory();
    const [cat, setCat] = useCat();
    const [menuMode] = useMenuMode();
    const [id, setId] = useId();
    const [, setEnd] = useEnd();
    const [, setVotes] = useVotes();
    const params = useParams();
    const threadId = Number(params.id);
    const navigate = useNavigate();
    const [notification, setNotification] = useNotification();
    const [reRender] = useRerender();
    const [user] = useUser();
    const query = queryString.parse(window.location.search);
    const onError = (err: AxiosError<any>) => {
        !notification.open &&
            setNotification({
                open: true,
                severity: "error",
                text: parseError(err),
            });
        err?.response?.status === 404 && navigate("/404", { replace: true });
        err?.response?.status === 403 && navigate("/403", { replace: true });
    };
    useEffect(() => {
        api.thread(threadId, finalPage)
            .then((data) => {
                data.slink && setThread(data);
                const historyIndex = history.findIndex((i) => i.id === threadId);
                if (historyIndex && history[historyIndex].c < data.count) {
                    history[historyIndex].c = data.count;
                    setHistory(history);
                    localStorage.setItem("history", JSON.stringify(history));
                }
                !cat && menuMode === "category" && setCat(data.category);
                id !== data.id && setId(data.id);
                setTitle(`${data.title} | Metahkg`);
                setDescription(
                    (query.c &&
                        (data.conversation?.[Number(query.c) - 1] as Comment)?.text) ||
                        (data.conversation?.[0] as Comment)?.text
                );
                if (!data.slink) {
                    data.slink = `${window.location.origin}/thread/${threadId}?page=1`;
                    setThread(data);
                }
                data.conversation.length % 25 && setEnd(true);
            })
            .catch(onError);

        if (user)
            api.meVotesThread(threadId)
                .then((data) => {
                    setVotes(data);
                })
                .catch(onError);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reRender]);
}
