import { parse } from "node-html-parser";
import DOMPurify from "dompurify";
import { DOMNode, domToReact } from "html-react-parser";
import Img from "../components/conversation/Image";
import Youtube from "./youtube";
import isURI from "is-uri";
/**
 * It takes a string, parses it, and then looks for any links in the string. If it finds a link, it
 * checks if the link is a YouTube link. If it is, it adds a YouTube link to the page
 * @param {string} comment - The comment to modify.
 * @returns The modified comment.
 */
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
export function replace(domNode: DOMNode) {
  if (
    //@ts-ignore
    domNode.name === "a"
  ) {
    //@ts-ignore
    const href: string = domNode.attribs?.href;
    if (
      href.startsWith("https://www.youtube.com") ||
      href.startsWith("https://youtu.be")
    ) {
      try {
        const url = new URL(href);
        const videoId = href.startsWith("https://youtu.be")
          ? url.pathname.replace("/", "")
          : url.searchParams.get("v");
        if (videoId) {
          return (
            <div>
              <Youtube videoId={videoId} />
              {domToReact([domNode])}
            </div>
          );
        }
      } catch {}
    }
  }
  //@ts-ignore
  if (domNode.name === "img" && domNode.attribs?.src) {
    // @ts-ignore
    const { src, height, width, style } = domNode.attribs;
    if (isURI(src)) return <Img src={src} height={height} width={width} style={style} />;
  }
}
/**
 * It takes an HTML node and
 * sets its attributes to open in a new tab
 * @param item - The node to be modified.
 */
function linkinnewtab(
  item: import("node-html-parser/dist/nodes/html").default
) {
  item.setAttribute("target", "_blank");
  item.setAttribute("rel", "noreferrer");
}
