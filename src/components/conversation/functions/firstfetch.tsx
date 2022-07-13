import { useEffect } from "react";
import { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../lib/api";
import { threadType } from "../../../types/conversation/thread";
import { useHistory, useNotification, useUser } from "../../ContextProvider";
import { useCat, useId, useMenuMode } from "../../MenuProvider";
import {
    useEnd,
    useFinalPage,
    useThread,
    useImages,
    useUserVotes,
    useRerender,
} from "../ConversationContext";
import { setDescription, setTitle } from "../../../lib/common";
import queryString from "query-string";
import { parseError } from "../../../lib/parseError";

export default function useFirstFetch() {
    const [finalPage] = useFinalPage();
    const [, setThread] = useThread();
    const [history, setHistory] = useHistory();
    const [cat, setCat] = useCat();
    const [menuMode] = useMenuMode();
    const [id, setId] = useId();
    const [, setEnd] = useEnd();
    const [images, setImages] = useImages();
    const [, setVotes] = useUserVotes();
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
                text: parseError(err),
            });
        err?.response?.status === 404 && navigate("/404", { replace: true });
        err?.response?.status === 403 && navigate("/403", { replace: true });
    };
    useEffect(() => {
        api.threads
            .get({ threadId, page: finalPage })
            .then((res: { data: threadType }) => {
                res.data.slink && setThread(res.data);
                const historyIndex = history.findIndex((i) => i.id === threadId);
                if (historyIndex && history[historyIndex].c < res.data.c) {
                    history[historyIndex].c = res.data.c;
                    setHistory(history);
                    localStorage.setItem("history", JSON.stringify(history));
                }
                !cat && menuMode === "category" && setCat(res.data.category);
                id !== res.data.id && setId(res.data.id);
                setTitle(`${res.data.title} | Metahkg`);
                setDescription(
                    (query.c && res.data.conversation?.[Number(query.c) - 1]?.text) ||
                        res.data.conversation?.[0]?.text
                );
                if (!res.data.slink) {
                    res.data.slink = `${window.location.origin}/thread/${threadId}?page=1`;
                    setThread(res.data);
                }
                res.data.conversation.length % 25 && setEnd(true);
            })
            .catch(onError);
        api.threads
            .images({ threadId })
            .then((res) => {
                res.data.forEach((item: { image: string }) => {
                    images.push({
                        src: item.image,
                    });
                });
                res.data.length && setImages(images);
            })
            .catch(onError);

        if (user)
            api.threads
                .userVotes({ threadId })
                .then((res) => {
                    setVotes(res.data);
                })
                .catch(onError);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reRender]);
}
