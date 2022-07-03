import { domToReact } from "html-react-parser";
import { Element, Text } from "domhandler/lib/node";
import Img from "../components/conversation/image/Image";
import Player from "../components/conversation/comment/player";
import TweetEmbed from "../components/conversation/comment/twitter";

import { LinkPreview } from "@dhaiwat10/react-link-preview";
import Spinner from "react-spinner-material";
import { Box } from "@mui/material";
import axios from "axios";
/**
 * @param {any} node
 */
export function replace(node: any): JSX.Element | void {
    const domNode: Element = node;
    if (domNode.attribs) {
        try {
            if (domNode.name === "a") {
                const href: string = domNode.attribs?.href;
                if (
                    [
                        /https:\/\/(www|m)\.facebook\.com\/.+\/videos\/\S+/i,
                        /https:\/\/fb\.watch\/\S+/i,
                        /https:\/\/(www|m)\.youtube\.com\/watch\?v=\S{11}(|&\S+)/i,
                        /https:\/\/youtu.be\/\S{11}/i,
                    ].some((item) => href.match(item))
                ) {
                    return (
                        <div>
                            <Player url={href} />
                            {domToReact([node])}
                        </div>
                    );
                } else if (
                    href.match(/https:\/\/(|mobile.)twitter.com\/\S+\/status\/\S+/i)
                ) {
                    const url = new URL(href);
                    const tweetid = url.pathname.split("/").pop();
                    if (tweetid)
                        return (
                            <div>
                                <TweetEmbed tweetId={tweetid} />
                                {domToReact([node])}
                            </div>
                        );
                }
                // TODO: embed instagram and facebook
                // TODO: Link preview for specific websites
                const firstChild = domNode.children?.[0] as Element;
                if (
                    domNode.children?.length === 1 &&
                    firstChild?.name === "img" &&
                    firstChild?.attribs
                ) {
                    const { src, height, width, style } = firstChild.attribs;
                    if (src && domNode.attribs.href === src) {
                        return (
                            <a
                                href={domNode.attribs.href}
                                onClick={(evt) => {
                                    evt.preventDefault();
                                }}
                            >
                                <Img
                                    src={src}
                                    height={height}
                                    width={width}
                                    style={style}
                                />
                            </a>
                        );
                    }
                } else if (
                    firstChild?.type === "text" &&
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
                                    maxWidth: "500px !important",
                                },
                            }}
                        >
                            <LinkPreview
                                url={href}
                                height={220}
                                imageHeight={150}
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
                                    <Spinner
                                        className="mt5 mb5"
                                        radius={50}
                                        color="gray"
                                        stroke={3}
                                        visible={true}
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
                    <a
                        href={src}
                        target={"_blank"}
                        rel={"noopener noreferrer"}
                        onClick={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <Img src={src} height={height} width={width} style={style} />
                    </a>
                );
            }
        } catch {}
    }
}
