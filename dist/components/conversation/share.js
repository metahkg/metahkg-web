import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ContentCopy, Facebook, Link as LinkIcon, Reddit, Telegram, Twitter, WhatsApp, } from "@mui/icons-material";
import { IconButton, TextField, Tooltip } from "@mui/material";
import { PopUp } from "../../lib/popup";
import { useNotification, useIsSmallScreen } from "../ContextProvider";
import { useShareLink, useShareOpen, useShareTitle } from "./ShareProvider";
/**
 * It shows a pop up with a text field and some buttons for
 * copying the text and sharing externally.
 * The text field shows the title and link of the post.
 */
export default function Share() {
    const [title] = useShareTitle();
    const [link] = useShareLink();
    const [open, setOpen] = useShareOpen();
    const text = title + "\n" + link + "\n- Shared from Metahkg forum";
    const [, setNotification] = useNotification();
    const isSmallScreen = useIsSmallScreen();
    const externals = [
        {
            icon: _jsx(Telegram, {}),
            title: "Share to Telegram",
            link: `tg://msg_url?text=${encodeURIComponent(title + "\n- Shared from Metahkg forum")}&url=${encodeURIComponent(link)}`,
        },
        {
            icon: _jsx(WhatsApp, {}),
            title: "Share to WhatsApp",
            link: `whatsapp://send?text=${encodeURIComponent(text)}`,
        },
        {
            icon: _jsx(Twitter, {}),
            title: "Share to Twitter",
            link: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
        },
        {
            icon: _jsx(Reddit, {}),
            title: "Share to Reddit",
            link: `https://www.reddit.com/submit?link=${encodeURIComponent(link)}&title=${encodeURIComponent(title)}`,
        },
        {
            icon: _jsx(Facebook, {}),
            title: "Share to Facebook",
            link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
        },
    ];
    return (_jsx(PopUp, Object.assign({ open: open, setOpen: setOpen, title: "Share" }, { children: _jsxs("div", Object.assign({ className: "ml10 mr10 text-align-start font-size-20" }, { children: [_jsx(TextField, { className: "mt0", sx: {
                        minWidth: isSmallScreen ? "250px" : "500px",
                    }, multiline: true, variant: "outlined", fullWidth: true, "aria-readonly": true, value: text }), _jsxs("div", Object.assign({ className: "mt5 overflow-auto nowrap" }, { children: [_jsx(Tooltip, Object.assign({ arrow: true, title: "Copy" }, { children: _jsx(IconButton, Object.assign({ onClick: async () => {
                                    await navigator.clipboard.writeText(text);
                                    setNotification({
                                        open: true,
                                        text: "Copied to Clipboard!",
                                    });
                                } }, { children: _jsx(ContentCopy, {}) })) })), _jsx(Tooltip, Object.assign({ arrow: true, title: "Copy link" }, { children: _jsx(IconButton, Object.assign({ onClick: async () => {
                                    await navigator.clipboard.writeText(link);
                                    setNotification({
                                        open: true,
                                        text: "Link copied to Clipboard!",
                                    });
                                } }, { children: _jsx(LinkIcon, {}) })) })), externals.map((external, index) => (_jsx(Tooltip, Object.assign({ arrow: true, title: external.title }, { children: _jsx("a", Object.assign({ href: external.link, target: "_blank", rel: "noreferrer" }, { children: _jsx(IconButton, { children: external.icon }) })) }), index)))] }))] })) })));
}
//# sourceMappingURL=share.js.map