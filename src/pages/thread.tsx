import React, {useEffect} from "react";
import Conversation from "../components/conversation";
import {Box} from "@mui/material";
import {useParams} from "react-router-dom";
import {Navigate} from "react-router-dom";
import {useCat, useId, useMenu} from "../components/MenuProvider";
import {useIsSmallScreen} from "../components/ContextProvider";
import isInteger from "is-sn-integer";
import {ShareProvider} from "../components/conversation/ShareProvider";
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

    useEffect(() => {
        if (isInteger(params.id)) {
            !menu && !isSmallScreen && setMenu(true);
            menu && isSmallScreen && setMenu(false);
            !category && !id && setId(Number(params.id));
        }
    });

    if (!isInteger(params.id)) return <Navigate to="/404" replace/>;

    const threadId = Number(params.id);

    return (
        <Box
            className="min-height-fullvh flex"
            sx={{
                backgroundColor: "primary.dark",
            }}
        >
            <div style={{width: isSmallScreen ? "100vw" : "70vw"}}>
                <ConversationProvider key={threadId} threadId={threadId}>
                    <ShareProvider>
                        <Conversation key={threadId} id={threadId}/>
                    </ShareProvider>
                </ConversationProvider>
            </div>
        </Box>
    );
}
