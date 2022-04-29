import { domToReact } from "html-react-parser";
import { Element } from "domhandler/lib/node";
import Img from "../components/conversation/image/Image";
import Player from "../components/conversation/comment/player";
import TweetEmbed from "../components/conversation/comment/twitter";

//import { LinkPreview } from "@dhaiwat10/react-link-preview";
/**
 * @param {DOMNode} node
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
                /*else {
                return (
                  <div>
                    <LinkPreview
                      url={href}
                      width={window.innerWidth < 760 ? "100%" : "65%"}
                      backgroundColor="#333"
                      primaryTextColor="white"
                      secondaryTextColor="#aca9a9"
                    />
                    {domToReact([node])}
                  </div>
                );
              }*/
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
                }
            }
            if (domNode.name === "img" && domNode.attribs?.src) {
                const { src, height, width, style } = domNode.attribs;
                return <Img src={src} height={height} width={width} style={style} />;
            }
        } catch {}
    }
}
