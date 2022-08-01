import React from "react";
import { GitHub, Reddit, Telegram } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import GitlabIcon from "../../lib/icons/gitlab";
import DiscordIcon from "../../lib/icons/dicord";

export default function PageBottom() {
    const socialIcons = [
        {
            icon: <GitlabIcon className="metahkg-grey-force" height={16} width={16} />,
            link: "https://gitlab.com/metahkg",
        },
        {
            icon: <GitHub className="font-size-17-force metahkg-grey-force" />,
            link: "https://github.com/metahkg",
        },
        {
            icon: <Telegram className="font-size-17-force metahkg-grey-force" />,
            link: "https://t.me/+WbB7PyRovUY1ZDFl",
        },
        {
            icon: (
                <DiscordIcon
                    height={17}
                    width={17}
                    className="font-size-17-force metahkg-grey-force"
                    color={"#aca9a9"}
                />
            ),
            link: "https://discord.gg/yrf2v8KGdc",
        },
        {
            icon: <Reddit className="font-size-17-force metahkg-grey-force" />,
            link: "https://reddit.com/r/metahkg",
        },
    ];
    return (
        <Box
            sx={{ marginBottom: 80 }}
            className="font-size-14 metahkg-grey-force text-align-center flex flex-dir-column justify-center align-center max-width-full max-height-full mt10"
        >
            <Box className="flex">
                {socialIcons.map((icon, index) => (
                    <a
                        key={index}
                        className={`metahkg-grey-force notextdecoration${
                            index !== socialIcons.length - 1 ? " mr7" : ""
                        }`}
                        href={icon.link}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <IconButton className="nopadding">{icon.icon}</IconButton>
                    </a>
                ))}
            </Box>
            <Box className="mt8">
                Copyright (c) 2022 Metahkg.{" "}
                <a
                    className="metahkg-grey-force"
                    href="https://gitlab.com/metahkg/metahkg/-/tree/master/LICENSE.md"
                    target="_blank"
                    rel="noreferrer"
                >
                    AGPL-3.0-or-later
                </a>
                .
            </Box>
        </Box>
    );
}
