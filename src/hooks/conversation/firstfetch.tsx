/*
 Copyright (C) 2022-present Metahkg Contributors

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { useEffect } from "react";
import { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../lib/api";
import {
    useHistory,
    useNotification,
    useServerConfig,
    useUser,
} from "../../components/AppContextProvider";
import { useCat, useId, useMenuMode } from "../../components/MenuProvider";
import {
    useEnd,
    useFinalPage,
    useThread,
    useVotes,
    useRerender,
} from "../../components/conversation/ConversationContext";
import { setDescription, setTitle } from "../../lib/common";
import queryString from "query-string";
import { parseError } from "../../lib/parseError";
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
    const [serverConfig] = useServerConfig();
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
                setTitle(`${data.title} | ${serverConfig?.branding || "Metahkg"}`);
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
