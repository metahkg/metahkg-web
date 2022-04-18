import { Refresh, Collections, Reply, Share as ShareIcon } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdate } from "./update";
import { useImages, useGalleryOpen, useThread } from "../ConversationContext";
import { useShareOpen, useShareLink, useShareTitle } from "../ShareProvider";
import { useNotification } from "../../ContextProvider";
export default function useBtns() {
    const update = useUpdate;
    const navigate = useNavigate();
    const [images] = useImages();
    const [, setGalleryOpen] = useGalleryOpen();
    const [, setNotification] = useNotification();
    const [shareOpen, setShareOpen] = useShareOpen();
    const [shareLink, setShareLink] = useShareLink();
    const [shareTitle, setShareTitle] = useShareTitle();
    const [thread] = useThread();
    const params = useParams();
    const threadId = Number(params.id);
    const btns = [
        {
            icon: <Refresh />,
            useAction: () => {
                update();
                const croot = document.getElementById("croot");
                const newscrollTop =
                    croot?.scrollHeight || 0 - (croot?.clientHeight || 0);
                // @ts-ignore
                croot.scrollTop = newscrollTop;
            },
            title: "Refresh",
        },
        {
            icon: <Collections />,
            useAction: () => {
                if (images.length) setGalleryOpen(true);
                else setNotification({ open: true, text: "No images!" });
            },
            title: "Images",
        },
        {
            icon: <Reply />,
            useAction: () => {
                navigate(`/comment/${threadId}`);
            },
            title: "Reply",
        },
        {
            icon: <ShareIcon className="font-size-19-force" />,
            useAction: () => {
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
