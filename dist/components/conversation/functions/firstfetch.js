import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../lib/api";
import { useHistory, useNotification, useUser } from "../../ContextProvider";
import { useCat, useId, useProfile, useRecall, useSearch } from "../../MenuProvider";
import { useEnd, useFinalPage, useThread, useImages, useUserVotes, useRerender, } from "../ConversationContext";
import { setDescription, setTitle } from "../../../lib/common";
import queryString from "query-string";
import { parseError } from "../../../lib/parseError";
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
    const [, setVotes] = useUserVotes();
    const params = useParams();
    const threadId = Number(params.id);
    const navigate = useNavigate();
    const [notification, setNotification] = useNotification();
    const [reRender] = useRerender();
    const [user] = useUser();
    const query = queryString.parse(window.location.search);
    const onError = (err) => {
        var _a, _b;
        !notification.open &&
            setNotification({
                open: true,
                text: parseError(err),
            });
        ((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.status) === 404 && navigate("/404", { replace: true });
        ((_b = err === null || err === void 0 ? void 0 : err.response) === null || _b === void 0 ? void 0 : _b.status) === 403 && navigate("/403", { replace: true });
    };
    useEffect(() => {
        api.threads
            .get({ threadId, page: finalPage })
            .then((res) => {
            var _a, _b, _c, _d;
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
            setDescription((query.c && ((_b = (_a = res.data.conversation) === null || _a === void 0 ? void 0 : _a[Number(query.c) - 1]) === null || _b === void 0 ? void 0 : _b.text)) ||
                ((_d = (_c = res.data.conversation) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.text));
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
            res.data.forEach((item) => {
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
//# sourceMappingURL=firstfetch.js.map