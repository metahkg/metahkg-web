import React, { useLayoutEffect } from "react";
import Conversation from "../components/conversation";
import { Box } from "@mui/material";
import { useParams, Navigate } from "react-router-dom";
import { useId, useMenu } from "../components/MenuProvider";
import { useIsSmallScreen } from "../components/ContextProvider";
import { ShareProvider } from "../components/conversation/ShareProvider";
import ConversationProvider from "../components/conversation/ConversationContext";

/**
 * Thread Component for /thread/:id
 * controls the menu and returns a Conversation
 */
export default function Thread() {
    const params = useParams();
    const [id, setId] = useId();
    const [menu, setMenu] = useMenu();
    const isSmallScreen = useIsSmallScreen();

    const threadId = Number(params.id);

    useLayoutEffect(() => {
        !menu && !isSmallScreen && setMenu(true);
        menu && isSmallScreen && setMenu(false);

        id !== threadId && setId(threadId);
    }, [menu, isSmallScreen, params.id, setMenu, setId, threadId, id]);

    if (!Number.isInteger(threadId)) return <Navigate to="/404" replace />;

    return (
        <Box
            className="min-h-screen flex"
            sx={{
                backgroundColor: "primary.dark",
            }}
        >
            <Box style={{ width: isSmallScreen ? "100vw" : "70vw" }}>
                <ConversationProvider key={threadId} threadId={threadId}>
                    <ShareProvider>
                        <Conversation key={threadId} id={threadId} />
                    </ShareProvider>
                </ConversationProvider>
            </Box>
        </Box>
    );
}
