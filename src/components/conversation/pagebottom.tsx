import React from "react";
import { GitHub, Reddit, Telegram } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import GitlabIcon from "../../lib/icons/gitlab";
import DiscordIcon from "../../lib/icons/dicord";

export default function PageBottom() {
    const socialIcons = [
        {
            icon: <GitlabIcon className="!text-metahkg-grey" height={16} width={16} />,
            link: "https://gitlab.com/metahkg",
        },
        {
            icon: <GitHub className="!text-[17px] !text-metahkg-grey" />,
            link: "https://github.com/metahkg",
        },
        {
            icon: <Telegram className="!text-[17px] !text-metahkg-grey" />,
            link: "https://t.me/+WbB7PyRovUY1ZDFl",
        },
        {
            icon: (
                <DiscordIcon
                    height={17}
                    width={17}
                    className="!text-[17px] !text-metahkg-grey"
                    color={"#aca9a9"}
                />
            ),
            link: "https://discord.gg/yrf2v8KGdc",
        },
        {
            icon: <Reddit className="!text-[17px] !text-metahkg-grey" />,
            link: "https://reddit.com/r/metahkg",
        },
    ];
    return (
        <Box
            sx={{ marginBottom: 10 }}
            className="text-[14px] !text-metahkg-grey text-center flex flex-col justify-center items-center max-w-full max-height-full !mt-[10px]"
        >
            <Box className="flex">
                {socialIcons.map((icon, index) => (
                    <a
                        key={index}
                        className={`!text-metahkg-grey !no-underline${
                            index !== socialIcons.length - 1 ? " mr7" : ""
                        }`}
                        href={icon.link}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <IconButton className="!p-0">{icon.icon}</IconButton>
                    </a>
                ))}
            </Box>
            <Box className="mt8">
                Copyright (c) 2022 Metahkg.{" "}
                <a
                    className="!text-metahkg-grey"
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
