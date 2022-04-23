import { Refresh, Collections, Reply, Share as ShareIcon } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdate } from "./update";
import { useImages, useGalleryOpen, useThread, useCRoot } from "../ConversationContext";
import { useShareOpen, useShareLink, useShareTitle } from "../ShareProvider";
import { useNotification } from "../../ContextProvider";
export default function useBtns() {
    const update = useUpdate();
    const navigate = useNavigate();
    const [images] = useImages();
    const [, setGalleryOpen] = useGalleryOpen();
    const [, setNotification] = useNotification();
    const [shareOpen, setShareOpen] = useShareOpen();
    const [shareLink, setShareLink] = useShareLink();
    const [shareTitle, setShareTitle] = useShareTitle();
    const [thread] = useThread();
    const croot = useCRoot();
    const params = useParams();
    const threadId = Number(params.id);
    const btns = [
        {
            icon: <Refresh />,
            action: () => {
                update();
                const newscrollTop =
                    croot.current?.scrollHeight || 0 - (croot.current?.clientHeight || 0);
                // @ts-ignore
                croot.current.scrollTop = newscrollTop;
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
                navigate(`/comment/${threadId}`);
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
