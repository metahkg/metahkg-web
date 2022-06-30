import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import { useIsSmallScreen } from "../components/ContextProvider";
import Comment from "../components/conversation/comment";
import { PopUp } from "./popup";
export default function CommentPopup(props) {
    const { open, setOpen, comment, showReplies, fetchComment, openComment } = props;
    const [isExpanded, setIsExpanded] = useState(!!showReplies);
    const isSmallScreen = useIsSmallScreen();
    return (_jsx(PopUp, Object.assign({ open: open, setOpen: setOpen, fullWidth: true, closeBtn: isExpanded, className: `${isExpanded ? "height-fullvh" : ""} novmargin noshadow ${isSmallScreen ? "nohmargin fullwidth-force" : ""}`, sx: {
            maxHeight: "none !important",
            bgcolor: isExpanded ? "primary.dark" : "transparent",
        } }, { children: _jsx(Comment, { comment: comment, noId: true, fetchComment: fetchComment, inPopUp: true, setIsExpanded: setIsExpanded, showReplies: showReplies, openComment: openComment }) })));
}
//# sourceMappingURL=commentPopup.js.map