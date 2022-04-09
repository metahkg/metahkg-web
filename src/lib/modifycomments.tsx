import { parse } from "node-html-parser";
import DOMPurify from "dompurify";
import { domToReact } from "html-react-parser";
import { Element } from "domhandler/lib/node";
import Img from "../components/conversation/Image";
import Player from "../components/conversation/player";
import TweetEmbed from "../components/conversation/twitter";

//import { LinkPreview } from "@dhaiwat10/react-link-preview";
export function modifycomment(comment: string) {
  comment = DOMPurify.sanitize(comment);
  let parsed = parse(comment);
  // eslint-disable-next-line no-loop-func
  parsed.querySelectorAll("a").forEach((item) => {
    linkinnewtab(item);
  });
  parsed.querySelectorAll("img").forEach((item) => {
    const height = Number(item.getAttribute("height"));
    if (height > 400) item.setAttribute("height", "400");
    if (height > 400 || !height) item.setAttribute("width", "auto");
  });
  return parsed.toString();
}

/**
 * It takes an HTML node and
 * sets its attributes to open in a new tab
 * @param item - The node to be modified.
 */
function linkinnewtab(item: import("node-html-parser/dist/nodes/html").default) {
  item.setAttribute("target", "_blank");
  item.setAttribute("rel", "noreferrer");
}

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
            /https:\/\/fb\.watch\/\.+/i,
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
        } else if (href.match(/https:\/\/(|mobile.)twitter.com\/\S+\/status\/\S+/i)) {
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
        if (
          domNode.children?.length === 1 &&
          // @ts-ignore
          domNode.children[0]?.name === "img" &&
          // @ts-ignore
          domNode.children[0]?.attribs
        ) {
          // @ts-ignore
          const { src, height, width, style } = domNode.children[0].attribs;
          if (src && domNode.attribs.href === src) {
            return (
              <a
                href={domNode.attribs.href}
                onClick={(evt) => {
                  evt.preventDefault();
                }}
              >
                <Img src={src} height={height} width={width} style={style} />
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
