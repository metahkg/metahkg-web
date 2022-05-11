import { Refresh, Collections, Reply, Share as ShareIcon } from "@mui/icons-material";
import { useUpdate } from "./update";
import {
    useImages,
    useGalleryOpen,
    useThread,
    useCRoot,
    useEditor,
    useThreadId,
} from "../ConversationContext";
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
    const croot = useCRoot();
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
        {
            icon: <Collections />,
            action: () => {
                if (images.length) setGalleryOpen(true);
                else setNotification({ open: true, text: "No images!" });
            },
            title: "Images",
        },
        {
            icon: <Reply />,
            action: () => {
                if (user) setEditor({ open: true });
                else
                    navigate(
                        `/users/signin?continue=true&returnto=${encodeURIComponent(
                            `/thread/${threadId}`
                        )}`
                    );
            },
            title: "Reply",
        },
        {
            icon: <ShareIcon className="font-size-19-force" />,
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
