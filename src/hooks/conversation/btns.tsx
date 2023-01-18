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

import {
    Refresh,
    Collections,
    Reply,
    Share as ShareIcon,
    Star,
} from "@mui/icons-material";
import { useUpdate } from "./update";
import {
    useGalleryOpen,
    useThread,
    useCRoot,
    useEditor,
    useThreadId,
    useCurrentPage,
} from "../../components/conversation/ConversationContext";
import {
    useShareOpen,
    useShareLink,
    useShareTitle,
} from "../../components/conversation/ShareProvider";
import {
    useNotification,
    useStarList,
    useUser,
} from "../../components/AppContextProvider";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { parseError } from "../../lib/parseError";

export default function useBtns() {
    const update = useUpdate();
    const threadId = useThreadId();
    const navigate = useNavigate();
    const [user] = useUser();
    const [, setGalleryOpen] = useGalleryOpen();
    const [, setNotification] = useNotification();
    const [shareOpen, setShareOpen] = useShareOpen();
    const [shareLink, setShareLink] = useShareLink();
    const [shareTitle, setShareTitle] = useShareTitle();
    const [thread] = useThread();
    const [, setEditor] = useEditor();
    const [currentPage] = useCurrentPage();
    const [starList, setStarList] = useStarList();
    const croot = useCRoot();
    const starred = Boolean(starList.find((i) => i.id === threadId));

    const btns = [
        {
            icon: <Refresh />,
            action: () => {
                update();
                const newscrollTop =
                    croot.current?.scrollHeight || 0 - (croot.current?.clientHeight || 0);
                if (croot.current) croot.current.scrollTop = newscrollTop;
            },
            title: "Refresh",
        },
        user && {
            icon: (
                <Star
                    {...(starred && {
                        color: "secondary",
                    })}
                />
            ),
            action: () => {
                setNotification({
                    open: true,
                    severity: "info",
                    text: `${starred ? "Unstarring" : "Starring"} thread...`,
                });
                (starred ? api.threadUnstar(threadId) : api.threadStar(threadId))
                    .then(() => {
                        setNotification({
                            open: true,
                            severity: "success",
                            text: `Thread ${starred ? "un" : ""}starred.`,
                        });
                        setStarList(
                            starred
                                ? starList.filter((i) => i.id !== threadId)
                                : [...starList, { id: threadId, date: new Date() }]
                        );
                        api.meStarred().then(setStarList);
                    })
                    .catch((err) => {
                        setNotification({
                            open: true,
                            severity: "error",
                            text: parseError(err),
                        });
                    });
            },
            title: starred ? "Unstar" : "Star",
        },
        {
            icon: <Collections />,
            action: () => {
                if (thread?.images?.length) setGalleryOpen(true);
                else
                    setNotification({
                        open: true,
                        severity: "error",
                        text: "No images!",
                    });
            },
            title: "Images",
        },
        {
            icon: <Reply />,
            action: () => {
                if (user) setEditor({ open: true });
                else
                    navigate(
                        `/users/login?continue=true&returnto=${encodeURIComponent(
                            `/thread/${threadId}?page=${currentPage}`
                        )}`
                    );
            },
            title: "Reply",
        },
        {
            icon: <ShareIcon className="!text-[19px]" />,
            action: () => {
                if (thread && thread.title && thread.slink) {
                    !shareOpen && setShareOpen(true);
                    shareTitle !== thread.title &&
                        thread.title &&
                        setShareTitle(thread.title);
                    shareLink !== thread.slink &&
                        thread.slink &&
                        setShareLink(thread.slink);
                }
            },
            title: "Share",
        },
    ].filter((x) => x) as {
        icon: React.ReactElement;
        action: () => void;
        title: string;
    }[];

    return btns;
}
