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

import { DOMNode, domToReact } from "html-react-parser";
import { Element, Text } from "domhandler/lib/node";
import { Box } from "@mui/material";
import { regex } from "./regex";
import React, { useCallback } from "react";
import loadable from "@loadable/component";
import { ReactLinkPreview } from "../components/conversation/comment/ReactLinkPreview";
import { useIsSmallScreen, useSettings } from "../components/AppContextProvider";
import { Player as VideoPlayer } from "video-react";
import "video-react/dist/video-react.css";
import PDF from "../components/conversation/comment/pdf";

const Img = loadable(() => import("../components/conversation/image/Image"));
const Player = loadable(() => import("../components/conversation/comment/player"));
const TweetEmbed = loadable(() => import("../components/conversation/comment/twitter"));
const SocialMediaEmbed = loadable(
    () => import("../components/conversation/comment/socialMediaEmbed")
);

export function useReplace(params: { quote?: boolean }) {
    const { quote } = params;
    const [settings] = useSettings();
    const isSmallScreen = useIsSmallScreen();

    return useCallback(
        (node: DOMNode) => {
            const domNode = node as Element;
            if (domNode.attribs) {
                try {
                    if (domNode.name === "a") {
                        const href: string = domNode.attribs?.href;
                        if (!href) return;
                        const redirectHref = `https://${
                            process.env.REACT_APP_REDIRECT_DOMAIN
                        }/?url=${encodeURIComponent(href)}${
                            (domNode.firstChild as unknown as Text)?.data === href
                                ? ""
                                : "&forceLanding=true"
                        }`;
                        if (
                            [regex.facebook.videos, regex.youtube, regex.streamable]
                                .flat()
                                .some((r) => r.test(href))
                        ) {
                            return (
                                <React.Fragment>
                                    <Player url={href} />
                                    {domToReact([node])}
                                </React.Fragment>
                            );
                        } else if (regex.twitter.some((r) => r.test(href))) {
                            const url = new URL(href);
                            const tweetId = url.pathname.split("/").pop();
                            if (tweetId)
                                return (
                                    <Box>
                                        <TweetEmbed tweetId={tweetId} />
                                        {domToReact([node])}
                                    </Box>
                                );
                        } else if (
                            [regex.instagram, regex.facebook.posts]
                                .flat()
                                .some((r) => r.test(href))
                        ) {
                            return (
                                <Box
                                    sx={{
                                        "& blockquote": {
                                            border: "0px transparent",
                                        },
                                    }}
                                >
                                    <SocialMediaEmbed url={href} />
                                    {domToReact([node])}
                                </Box>
                            );
                        }

                        // untrusted from now on
                        domNode.attribs.href = redirectHref;

                        const firstChild = domNode.children?.[0] as Element;
                        if (
                            domNode.children?.length === 1 &&
                            firstChild?.name === "img" &&
                            firstChild?.attribs
                        ) {
                            const { src, height, width, style } = firstChild.attribs;
                            if (src && href === src) {
                                return (
                                    <Img
                                        src={src}
                                        height={height}
                                        width={width}
                                        style={style}
                                        small={quote}
                                    />
                                );
                            }
                        } else if (
                            settings.linkPreview &&
                            (firstChild as unknown as Text)?.type === "text"
                        ) {
                            if (
                                href &&
                                [href, decodeURIComponent(href)].some(
                                    (i) => i === (firstChild as unknown as Text)?.data
                                )
                            ) {
                                if (settings.pdfViewer && href.endsWith(".pdf")) {
                                    return (
                                        <>
                                            <PDF src={href} />
                                            {domToReact([domNode])}
                                        </>
                                    );
                                }
                                if (settings.videoPlayer && href.endsWith(".mp4")) {
                                    return (
                                        <>
                                            <Box
                                                width={isSmallScreen ? "100%" : "65%"}
                                                className="mb-[5px]"
                                            >
                                                <VideoPlayer playsInline preload="none">
                                                    <source src={href} />
                                                </VideoPlayer>
                                            </Box>
                                            {domToReact([domNode])}
                                        </>
                                    );
                                }
                                return (
                                    <ReactLinkPreview
                                        quote={quote}
                                        url={redirectHref}
                                        originalUrl={href}
                                        node={domNode}
                                    />
                                );
                            }
                        }
                        return domNode;
                    }
                    if (domNode.name === "img" && domNode.attribs?.src) {
                        const { src, height, width, style } = domNode.attribs;
                        return (
                            <Img
                                src={src}
                                height={height}
                                width={width}
                                style={style}
                                small={quote}
                            />
                        );
                    }
                } catch {}
            }
        },
        [
            settings.linkPreview,
            settings.pdfViewer,
            settings.videoPlayer,
            quote,
            isSmallScreen,
        ]
    );
}
