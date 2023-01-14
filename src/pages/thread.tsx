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

import React, { useLayoutEffect } from "react";
import Conversation from "../components/conversation";
import { Box } from "@mui/material";
import { useParams, Navigate } from "react-router-dom";
import { useId, useMenu } from "../components/MenuProvider";
import { useIsSmallScreen } from "../components/AppContextProvider";
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
            <Box className="w-full">
                <ConversationProvider key={threadId} threadId={threadId}>
                    <ShareProvider>
                        <Conversation key={threadId} id={threadId} />
                    </ShareProvider>
                </ConversationProvider>
            </Box>
        </Box>
    );
}
