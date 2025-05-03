/*
 Copyright (C) 2022-present Wong Chun Yat (wcyat)

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

import React, { useMemo } from "react";
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
import { useNotification, useIsSmallScreen } from "../AppContextProvider";
import { useShareLink, useShareOpen, useShareTitle } from "./ShareProvider";
import { Link } from "../../lib/link";
import { memo } from "react";
import { useTranslation } from "react-i18next";

/**
 * It shows a pop up with a text field and some buttons for
 * copying the text and sharing externally.
 * The text field shows the title and link of the post.
 */
const Share = memo(function Share() {
    const [title] = useShareTitle();
    const [link] = useShareLink();
    const [open, setOpen] = useShareOpen();
    const { t } = useTranslation();
    const text = title + "\n" + link + "\n" + t("share.shared_from");
    const [, setNotification] = useNotification();
    const isSmallScreen = useIsSmallScreen();
    type external = {
        icon: React.JSX.Element;
        title: string;
        link: string;
    };
    const externals: external[] = useMemo(
        () => [
            {
                icon: <Telegram />,
                title: t("share.share_to_telegram"),
                link: `tg://msg_url?text=${encodeURIComponent(
                    title + "\n" + t("share.shared_from")
                )}&url=${encodeURIComponent(link)}`,
            },
            {
                icon: <WhatsApp />,
                title: t("share.share_to_whatsapp"),
                link: `whatsapp://send?text=${encodeURIComponent(text)}`,
            },
            {
                icon: <Twitter />,
                title: t("share.share_to_twitter"),
                link: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
            },
            {
                icon: <Reddit />,
                title: t("share.share_to_reddit"),
                link: `https://www.reddit.com/submit?link=${encodeURIComponent(
                    link
                )}&title=${encodeURIComponent(title)}`,
            },
            {
                icon: <Facebook />,
                title: t("share.share_to_facebook"),
                link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    link
                )}`,
            },
        ],
        [link, text, title, t]
    );

    return (
        <PopUp open={open} setOpen={setOpen} title={t("share.title")}>
            <Box className="!mx-2 text-start text-5">
                <TextField
                    className={`!mt-0 ${
                        isSmallScreen ? "!min-w-[250px]" : "!min-w-[500px]"
                    }`}
                    multiline
                    variant="outlined"
                    fullWidth
                    aria-readonly
                    value={text}
                />
                <Box className="!mt-1 overflow-auto whitespace-nowrap">
                    <Tooltip arrow title={t("share.copy_tooltip")}>
                        <IconButton
                            onClick={async () => {
                                await navigator.clipboard.writeText(text);
                                setNotification({
                                    open: true,
                                    severity: "success",
                                    text: t("share.copied_to_clipboard"),
                                });
                            }}
                        >
                            <ContentCopy />
                        </IconButton>
                    </Tooltip>
                    <Tooltip arrow title={t("share.copy_link_tooltip")}>
                        <IconButton
                            onClick={async () => {
                                await navigator.clipboard.writeText(link);
                                setNotification({
                                    open: true,
                                    severity: "success",
                                    text: t("share.link_copied_to_clipboard"),
                                });
                            }}
                        >
                            <LinkIcon />
                        </IconButton>
                    </Tooltip>
                    {externals.map((external, index) => (
                        <Tooltip key={index} arrow title={external.title}>
                            <Link
                                href={external.link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <IconButton>{external.icon}</IconButton>
                            </Link>
                        </Tooltip>
                    ))}
                </Box>
            </Box>
        </PopUp>
    );
});
export default Share;
