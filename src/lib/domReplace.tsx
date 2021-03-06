import { DOMNode, domToReact } from "html-react-parser";
import { Element, Text } from "domhandler/lib/node";
import Img from "../components/conversation/image/Image";
import Player from "../components/conversation/comment/player";
import TweetEmbed from "../components/conversation/comment/twitter";
import { LinkPreview } from "@dhaiwat10/react-link-preview";
import { Box } from "@mui/material";
import axios from "axios";
import Loader from "./loader";
import { regex } from "./regex";
import SocialMediaEmbed from "../components/conversation/comment/socialMediaEmbed";
import React from "react";

export const replace = (params: { quote?: boolean }) => {
    const { quote } = params;
    return (node: DOMNode) => {
        const domNode = node as Element;
        if (domNode.attribs) {
            try {
                if (domNode.name === "a") {
                    const href: string = domNode.attribs?.href;
                    if (
                        [regex.facebook.videos, regex.youtube]
                            .flat()
                            .some((item) => href.match(item))
                    ) {
                        return (
                            <React.Fragment>
                                <Player url={href} />
                                {domToReact([node])}
                            </React.Fragment>
                        );
                    } else if (regex.twitter.some((item) => href.match(item))) {
                        const url = new URL(href);
                        const tweetId = url.pathname.split("/").pop();
                        if (tweetId)
                            return (
                                <div>
                                    <TweetEmbed tweetId={tweetId} />
                                    {domToReact([node])}
                                </div>
                            );
                    } else if (
                        [regex.instagram, regex.facebook.posts]
                            .flat()
                            .some((item) => href.match(item))
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
                        domNode?.attribs?.href === (firstChild as unknown as Text)?.data
                    ) {
                        return (
                            <Box
                                sx={{
                                    "& .Container, & .Container *:hover, & .LowerContainer, & .LowerContainer:hover, & .LinkPreview, & .LinkPreview:hover, & .LinkPreview *, & .LinkPreview *:hover":
                                        {
                                            backgroundColor: "#333 !important",
                                        },
                                    "& .Container": {
                                        maxWidth: `${quote ? 400 : 450}px !important`,
                                    },
                                    [`& .Title${quote ? ", & .Description" : ""}`]: {
                                        whiteSpace: "nowrap",
                                        textOverflow: "ellipsis",
                                        overflow: "hidden",
                                    },
                                    ...(quote && {
                                        "& .Description": {
                                            display: "inline-block",
                                        },
                                    }),
                                }}
                            >
                                <LinkPreview
                                    url={href}
                                    height={quote ? 200 : 280}
                                    imageHeight={250}
                                    width={"100%"}
                                    className="mt5 mb5 LinkPreview"
                                    borderColor="#555"
                                    backgroundColor="#333"
                                    primaryTextColor="white"
                                    secondaryTextColor="#aca9a9"
                                    descriptionLength={60}
                                    fetcher={async (url: string) => {
                                        const { data } = await axios.get(
                                            `https://rlp.metahkg.org/v2?url=${url}`
                                        );
                                        return data.metadata;
                                    }}
                                    customLoader={
                                        <Loader
                                            position="flex-start"
                                            className="mt5 mb5"
                                            sxProgress={{ color: "darkgrey" }}
                                            thickness={2}
                                            size={50}
                                        />
                                    }
                                />
                                {domToReact([node])}
                            </Box>
                        );
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
