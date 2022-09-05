import React from "react";
import {
    ContentCopy,
    Facebook,
    Link as LinkIcon,
    Reddit,
    Telegram,
    Twitter,
    WhatsApp,
} from "@mui/icons-material";
import { Box, IconButton, TextField, Tooltip } from "@mui/material";
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
    type external = {
        icon: JSX.Element;
        title: string;
        link: string;
    };
    const externals: external[] = [
        {
            icon: <Telegram />,
            title: "Share to Telegram",
            link: `tg://msg_url?text=${encodeURIComponent(
                title + "\n- Shared from Metahkg forum"
            )}&url=${encodeURIComponent(link)}`,
        },
        {
            icon: <WhatsApp />,
            title: "Share to WhatsApp",
            link: `whatsapp://send?text=${encodeURIComponent(text)}`,
        },
        {
            icon: <Twitter />,
            title: "Share to Twitter",
            link: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
        },
        {
            icon: <Reddit />,
            title: "Share to Reddit",
            link: `https://www.reddit.com/submit?link=${encodeURIComponent(
                link
            )}&title=${encodeURIComponent(title)}`,
        },
        {
            icon: <Facebook />,
            title: "Share to Facebook",
            link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                link
            )}`,
        },
    ];
    return (
        <PopUp open={open} setOpen={setOpen} title="Share">
            <Box className="!ml-[10px] !mr-[10px] text-start text-[20px]">
                <TextField
                    className="!mt-[0px]"
                    sx={{
                        minWidth: isSmallScreen ? "250px" : "500px",
                    }}
                    multiline
                    variant="outlined"
                    fullWidth
                    aria-readonly
                    value={text}
                />
                <Box className="!mt-[5px] overflow-auto whitespace-nowrap">
                    <Tooltip arrow title="Copy">
                        <IconButton
                            onClick={async () => {
                                await navigator.clipboard.writeText(text);
                                setNotification({
                                    open: true,
                                    severity: "success",
                                    text: "Copied to Clipboard!",
                                });
                            }}
                        >
                            <ContentCopy />
                        </IconButton>
                    </Tooltip>
                    <Tooltip arrow title="Copy link">
                        <IconButton
                            onClick={async () => {
                                await navigator.clipboard.writeText(link);
                                setNotification({
                                    open: true,
                                    severity: "success",
                                    text: "Link copied to Clipboard!",
                                });
                            }}
                        >
                            <LinkIcon />
                        </IconButton>
                    </Tooltip>
                    {externals.map((external, index) => (
                        <Tooltip key={index} arrow title={external.title}>
                            <a href={external.link} target="_blank" rel="noreferrer">
                                <IconButton>{external.icon}</IconButton>
                            </a>
                        </Tooltip>
                    ))}
                </Box>
            </Box>
        </PopUp>
    );
}
