import { jsx as _jsx } from "react/jsx-runtime";
import Conversation from "../components/conversation";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useCat, useId, useMenu } from "../components/MenuProvider";
import { useIsSmallScreen } from "../components/ContextProvider";
import isInteger from "is-sn-integer";
import { ShareProvider } from "../components/conversation/ShareProvider";
import ConversationProvider from "../components/conversation/ConversationContext";
/**
 * Thread Component for /thread/:id
 * controls the menu and returns a Conversation
 */
export default function Thread() {
    const params = useParams();
    const [category] = useCat();
    const [id, setId] = useId();
    const [menu, setMenu] = useMenu();
    const isSmallScreen = useIsSmallScreen();
    if (!isInteger(params.id))
        return _jsx(Navigate, { to: "/404", replace: true });
    !menu && !isSmallScreen && setMenu(true);
    menu && isSmallScreen && setMenu(false);
    !category && !id && setId(Number(params.id));
    const threadId = Number(params.id);
    return (_jsx(Box, Object.assign({ className: "min-height-fullvh flex", sx: {
            backgroundColor: "primary.dark",
        } }, { children: _jsx("div", Object.assign({ style: { width: isSmallScreen ? "100vw" : "70vw" } }, { children: _jsx(ConversationProvider, Object.assign({ threadId: threadId }, { children: _jsx(ShareProvider, { children: _jsx(Conversation, { id: threadId }, threadId) }) }), threadId) })) })));
}
//# sourceMappingURL=thread.js.map