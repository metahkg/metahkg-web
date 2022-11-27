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

import React, { SetStateAction, useState } from "react";
import { useIsSmallScreen } from "../components/AppContextProvider";
import Comment from "../components/conversation/comment";
import { PopUp } from "./popup";
import { Comment as CommentType } from "@metahkg/api";

export default function CommentPopup(props: {
    open: boolean;
    setOpen: React.Dispatch<SetStateAction<boolean>>;
    showReplies?: boolean;
    comment: CommentType;
    fetchComment?: boolean;
}) {
    const { open, setOpen, comment, showReplies, fetchComment } = props;
    const [isExpanded, setIsExpanded] = useState(Boolean(showReplies));
    const isSmallScreen = useIsSmallScreen();
    return (
        <PopUp
            open={open}
            setOpen={setOpen}
            fullWidth
            closeBtn={isExpanded}
            className={`${isExpanded ? "h-screen" : ""} !my-0 !shadow-none ${
                isSmallScreen ? "!mx-0 !w-full" : ""
            }`}
            sx={{
                maxHeight: "none !important",
                bgcolor: isExpanded ? "primary.dark" : "transparent",
            }}
        >
            <Comment
                comment={comment}
                noId
                fetchComment={fetchComment}
                inPopUp
                setIsExpanded={setIsExpanded}
                showReplies={showReplies}
            />
        </PopUp>
    );
}
