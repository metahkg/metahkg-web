import React from "react";
import { GitHub, Reddit, Telegram } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import GitlabIcon from "../../lib/icons/gitlab";
import DiscordIcon from "../../lib/icons/dicord";
import { Link } from "../../lib/link";

export default function PageBottom() {
    const socialIcons = [
        {
            icon: (
                <GitlabIcon
                    className="text-inherit-size text-inherit"
                    height={16}
                    width={16}
                />
            ),
            link: "https://gitlab.com/metahkg",
        },
        {
            icon: <GitHub fontSize="inherit" className="!text-inherit" />,
            link: "https://github.com/metahkg",
        },
        {
            icon: <Telegram fontSize="inherit" className="!text-inherit" />,
            link: "https://t.me/+WbB7PyRovUY1ZDFl",
        },
        {
            icon: (
                <DiscordIcon
                    height={17}
                    width={17}
                    className="text-inherit-size"
                    color="#aca9a9"
                />
            ),
            link: "https://discord.gg/yrf2v8KGdc",
        },
        {
            icon: <Reddit fontSize="inherit" className="!text-inherit" />,
            link: "https://reddit.com/r/metahkg",
        },
    ];
    return (
        <Box className="mt-2 mb-[80px] !text-metahkg-grey text-center grid grid-cols-1 gap-2 justify-center items-center max-w-full max-height-full">
            <Box className="flex justify-center items-center text-[17px]">
                {socialIcons.map((icon, index) => (
                    <Link
                        key={index}
                        className={`!text-inherit !text-inherit-size !no-underline${
                            index !== socialIcons.length - 1 ? " !mr-2" : ""
                        }`}
                        color="inherit"
                        href={icon.link}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <IconButton className="!p-0 !text-inherit-size !text-inherit">
                            {icon.icon}
                        </IconButton>
                    </Link>
                ))}
            </Box>
            <Typography className="!text-sm">
                Copyright (c) 2022-present Metahkg Contributors.{" "}
                <Link
                    href="https://gitlab.com/metahkg/metahkg/-/tree/master/LICENSE.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="!text-metahkg-grey"
                >
                    AGPL-3.0-or-later
                </Link>
                .
            </Typography>
        </Box>
    );
}
