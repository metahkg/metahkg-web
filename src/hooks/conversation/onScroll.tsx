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

import { useHistory } from "../../components/AppContextProvider";
import {
    useEnd,
    useThread,
    useThreadId,
    useUpdating,
} from "../../components/conversation/ConversationContext";
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
                (e.target.clientHeight >= diff - 5 &&
                    e.target.clientHeight <= diff + 5) ||
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

            const currentComment = arr.reduce((a, b) => (a.top < b.top ? a : b)).id;

            if (history[index]?.cid !== currentComment && currentComment) {
                history[index].cid = currentComment;
                setHistory(history);
                localStorage.setItem("history", JSON.stringify(history));
            }
        }
    };
}
