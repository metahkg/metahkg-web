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
import React from "react";
import loadable from "@loadable/component";
import { ReactLinkPreview } from "../components/conversation/comment/ReactLInkPreview";

const Img = loadable(() => import("../components/conversation/image/Image"));
const Player = loadable(() => import("../components/conversation/comment/player"));
const TweetEmbed = loadable(() => import("../components/conversation/comment/twitter"));
const SocialMediaEmbed = loadable(
    () => import("../components/conversation/comment/socialMediaEmbed")
);

export const replace = (params: { quote?: boolean }) => {
    const { quote } = params;
    return (node: DOMNode) => {
        const domNode = node as Element;
        if (domNode.attribs) {
            try {
                if (domNode.name === "a") {
                    const href: string = domNode.attribs?.href;
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
                    // TODO: embed instagram and facebook
                    const firstChild = domNode.children?.[0] as Element;
                    if (
                        domNode.children?.length === 1 &&
                        firstChild?.name === "img" &&
                        firstChild?.attribs
                    ) {
                        const { src, height, width, style } = firstChild.attribs;
                        if (src && domNode.attribs.href === src) {
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
                        (firstChild as unknown as Text)?.type === "text" &&
                        [
                            domNode?.attribs?.href,
                            decodeURIComponent(domNode?.attribs?.href),
                        ].some((i) => i === (firstChild as unknown as Text)?.data)
                    ) {
                        return <ReactLinkPreview quote={quote} url={href} node={node} />;
                    }
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
    };
};
