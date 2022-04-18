import { useNavigate } from "react-router-dom";
import { useCurrentPage, useLastHeight, useThread } from "../ConversationContext";
import queryString from "query-string";
import { OnVisibilityChangeData } from "react-visibility-detector/dist/types";
export default function useOnVisibilityChange() {
    const croot = document.getElementById("croot");
    const lastHeight = useLastHeight();
    const [, setCurrentPage] = useCurrentPage();
    const [thread] = useThread();
    const navigate = useNavigate();
    const query = queryString.parse(window.location.search);
    return (isVisible: OnVisibilityChangeData, page: number) => {
        let Page = page;
        if (isVisible) {
            lastHeight.current = croot?.scrollTop || lastHeight.current;
            if (Page !== Number(query.page) && Page) {
                navigate(`${window.location.pathname}?page=${Page}`, {
                    replace: true,
                });
                setCurrentPage(Page);
            }
        }
        if (!isVisible && thread && thread.conversation.length) {
            if (lastHeight.current !== croot?.scrollTop) {
                Page =
                    // @ts-ignore
                    croot.scrollTop > lastHeight.current ? Page : Page - 1;
                if (lastHeight.current && Page !== Number(query.page) && Page) {
                    navigate(`${window.location.pathname}?page=${Page}`, {
                        replace: true,
                    });
                    setCurrentPage(Page);
                }
            }
        }
    };
}