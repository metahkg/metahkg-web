import { jsx as _jsx } from "react/jsx-runtime";
import { Refresh, Collections, Reply, Share as ShareIcon } from "@mui/icons-material";
import { useUpdate } from "./update";
import { useImages, useGalleryOpen, useThread, useCRoot, useEditor, useThreadId, useCurrentPage, } from "../ConversationContext";
import { useShareOpen, useShareLink, useShareTitle } from "../ShareProvider";
import { useNotification, useUser } from "../../ContextProvider";
import { useNavigate } from "react-router-dom";
export default function useBtns() {
    const update = useUpdate();
    const threadId = useThreadId();
    const navigate = useNavigate();
    const [user] = useUser();
    const [images] = useImages();
    const [, setGalleryOpen] = useGalleryOpen();
    const [, setNotification] = useNotification();
    const [shareOpen, setShareOpen] = useShareOpen();
    const [shareLink, setShareLink] = useShareLink();
    const [shareTitle, setShareTitle] = useShareTitle();
    const [thread] = useThread();
    const [, setEditor] = useEditor();
    const [currentPage] = useCurrentPage();
    const croot = useCRoot();
    const btns = [
        {
            icon: _jsx(Refresh, {}),
            action: () => {
                var _a, _b;
                update();
                const newscrollTop = ((_a = croot.current) === null || _a === void 0 ? void 0 : _a.scrollHeight) || 0 - (((_b = croot.current) === null || _b === void 0 ? void 0 : _b.clientHeight) || 0);
                if (croot.current)
                    croot.current.scrollTop = newscrollTop;
            },
            title: "Refresh",
        },
        {
            icon: _jsx(Collections, {}),
            action: () => {
                if (images.length)
                    setGalleryOpen(true);
                else
                    setNotification({ open: true, text: "No images!" });
            },
            title: "Images",
        },
        {
            icon: _jsx(Reply, {}),
            action: () => {
                if (user)
                    setEditor({ open: true });
                else
                    navigate(`/users/login?continue=true&returnto=${encodeURIComponent(`/thread/${threadId}?page=${currentPage}`)}`);
            },
            title: "Reply",
        },
        {
            icon: _jsx(ShareIcon, { className: "font-size-19-force" }),
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
    ];
    return btns;
}
//# sourceMappingURL=btns.js.map