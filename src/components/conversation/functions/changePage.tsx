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

import { useNavigate } from "react-router-dom";
import { api } from "../../../lib/api";
import { useNotification } from "../../AppContextProvider";
import {
    useCurrentPage,
    useEnd,
    useFinalPage,
    useLastHeight,
    useLoading,
    usePages,
    useThread,
    useThreadId,
} from "../ConversationContext";
import { roundup } from "../../../lib/common";
import { parseError } from "../../../lib/parseError";

export default function useChangePage() {
    const [, setLoading] = useLoading();
    const [pages, setPages] = usePages();
    const [finalPage, setFinalPage] = useFinalPage();
    const lastHeight = useLastHeight();
    const [, setEnd] = useEnd();
    const [, setCurrentPage] = useCurrentPage();
    const [, setNotification] = useNotification();
    const [thread, setThread] = useThread();
    const navigate = useNavigate();
    const threadId = useThreadId();
    const firstPage = roundup((thread?.conversation?.[0]?.id || 1) / 25);

    return (newPage: number, callback?: () => void) => {
        if (thread) {
            setCurrentPage(newPage);

            navigate(`${window.location.pathname}?page=${newPage}`, { replace: true });

            const targetElement = document.getElementById(`${newPage}`);

            if (targetElement)
                return targetElement.scrollIntoView({ behavior: "smooth" });

            const shouldReRender =
                newPage - finalPage !== 1 && newPage - firstPage !== -1;

            if (shouldReRender) {
                lastHeight.current = 0;
                setThread({ ...thread, conversation: [] });
            }

            setLoading(true);
            setEnd(false);
            setPages(shouldReRender ? 1 : pages + 1);
            setFinalPage(
                (shouldReRender && newPage) || newPage - finalPage === 1
                    ? newPage
                    : finalPage
            );

            api.thread(threadId, newPage)
                .then((data) => {
                    if (!data.conversation.length)
                        return setNotification({
                            open: true,
                            severity: "error",
                            text: "Page not found!",
                        });

                    setThread(
                        shouldReRender
                            ? data
                            : {
                                  ...thread,
                                  ...data,
                                  conversation:
                                      newPage - finalPage === 1
                                          ? [...thread.conversation, ...data.conversation]
                                          : [
                                                ...data.conversation,
                                                ...thread.conversation,
                                            ],
                              }
                    );

                    data.conversation.length % 25 && setEnd(true);

                    setTimeout(() => {
                        setCurrentPage(newPage);

                        document
                            .getElementById(String(newPage))
                            ?.scrollIntoView({ behavior: "smooth" });

                        navigate(`${window.location.pathname}?page=${newPage}`, {
                            replace: true,
                        });

                        callback && setTimeout(callback);
                    });
                })
                .catch((err) => {
                    setNotification({
                        open: true,
                        severity: "error",
                        text: parseError(err),
                    });
                });
        }
    };
}
