import { useNavigate } from "react-router-dom";
import { useCRoot, useCurrentPage, useLastHeight, useThread, } from "../ConversationContext";
import queryString from "query-string";
export default function useOnVisibilityChange() {
    const croot = useCRoot();
    const lastHeight = useLastHeight();
    const [, setCurrentPage] = useCurrentPage();
    const [thread] = useThread();
    const navigate = useNavigate();
    const query = queryString.parse(window.location.search);
    return (isVisible, page) => {
        var _a, _b;
        let Page = page;
        if (isVisible) {
            lastHeight.current = ((_a = croot.current) === null || _a === void 0 ? void 0 : _a.scrollTop) || lastHeight.current;
            if (Page !== Number(query.page) && Page) {
                navigate(`${window.location.pathname}?page=${Page}`, {
                    replace: true,
                });
                setCurrentPage(Page);
            }
        }
        if (!isVisible && thread && thread.conversation.length) {
            if (lastHeight.current !== ((_b = croot.current) === null || _b === void 0 ? void 0 : _b.scrollTop) && croot.current) {
                Page = croot.current.scrollTop > lastHeight.current ? Page : Page - 1;
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
//# sourceMappingURL=onVisibilityChange.js.map