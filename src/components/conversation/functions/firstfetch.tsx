import { useEffect } from "react";
import { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../lib/api";
import { threadType } from "../../../types/conversation/thread";
import { useHistory, useNotification, useUser } from "../../ContextProvider";
import { useCat, useId, useProfile, useRecall, useSearch } from "../../MenuProvider";
import {
    useEnd,
    useFinalPage,
    useThread,
    useImages,
    useVotes,
    useRerender,
} from "../ConversationContext";
import { setDescription, setTitle } from "../../../lib/common";
import queryString from "query-string";
// @ts-ignore
import h2p from "html2plaintext";

export default function useFirstFetch() {
    const [finalPage] = useFinalPage();
    const [, setThread] = useThread();
    const [history, setHistory] = useHistory();
    const [cat, setCat] = useCat();
    const [recall] = useRecall();
    const [search] = useSearch();
    const [profile] = useProfile();
    const [id, setId] = useId();
    const [, setEnd] = useEnd();
    const [images, setImages] = useImages();
    const [, setVotes] = useVotes();
    const params = useParams();
    const threadId = Number(params.id);
    const navigate = useNavigate();
    const [notification, setNotification] = useNotification();
    const [reRender] = useRerender();
    const [user] = useUser();
    const query = queryString.parse(window.location.search);
    const onError = (err: AxiosError) => {
        !notification.open &&
            setNotification({
                open: true,
                text: err?.response?.data?.error || err?.response?.data || "",
            });
        err?.response?.status === 404 && navigate("/404", { replace: true });
        err?.response?.status === 401 && navigate("/401", { replace: true });
    };
    useEffect(() => {
        api.get(`/posts/thread/${threadId}?page=${finalPage}`)
            .then((res: { data: threadType }) => {
                res.data.slink && setThread(res.data);
                const historyIndex = history.findIndex((i) => i.id === threadId);
                if (historyIndex && history[historyIndex].c < res.data.c) {
                    history[historyIndex].c = res.data.c;
                    setHistory(history);
                    localStorage.setItem("history", JSON.stringify(history));
                }
                !cat && !(recall || search || profile) && setCat(res.data.category);
                id !== res.data.id && setId(res.data.id);
                setTitle(`${res.data.title} | Metahkg`);
                setDescription(
                    h2p(
                        (query.c && res.data.conversation?.[Number(query.c)]?.comment) ||
                            res.data.conversation?.[0]?.comment
                    )
                );
                if (!res.data.slink) {
                    res.data.slink = `${window.location.origin}/thread/${threadId}?page=1`;
                    setThread(res.data);
                    console.log("setthread");
                }
                res.data.conversation.length % 25 && setEnd(true);
            })
            .catch(onError);
        api.get(`/posts/images/${threadId}`)
            .then((res) => {
                res.data.forEach((item: { image: string }) => {
                    images.push({
                        src: item.image,
                    });
                });
                res.data.length && setImages(images);
            })
            .catch(onError);
        if (user) {
            api.get(`/posts/uservotes/${threadId}`)
                .then((res) => {
                    setVotes(res.data);
                })
                .catch(onError);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reRender]);
}
