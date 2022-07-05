import React from "react";
import { GitHub, Telegram } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import GitlabIcon from "../../lib/icons/gitlab";

export default function PageBottom() {
    const socialicons = [
        {
            icon: <GitlabIcon className="metahkg-grey-force" height={17} width={17} />,
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
    ];
    return (
        <div
            style={{ marginBottom: 70 }}
            className="font-size-14 metahkg-grey-force text-align-center flex flex-dir-column justify-center align-center max-width-full max-height-full mt10"
        >
            <div className="flex">
                {socialicons.map((icon, index) => (
                    <a
                        key={index}
                        className={`metahkg-grey-force notextdecoration${
                            index !== socialicons.length - 1 ? " mr7" : ""
                        }`}
                        href={icon.link}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <IconButton className="nopadding">{icon.icon}</IconButton>
                    </a>
                ))}
            </div>
            <div className="mt8">
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
            </div>
        </div>
    );
}
