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
import { api } from "../../lib/api";
import {
    useCurrentPage,
    useEnd,
    useFinalPage,
    useLastHeight,
    usePages,
    useThread,
    useThreadId,
    useUpdating,
} from "../../components/conversation/ConversationContext";

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
                    const conversation = [...thread.conversation, ...data.conversation];
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
