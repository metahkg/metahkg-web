import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { domToReact } from "html-react-parser";
import Img from "../components/conversation/image/Image";
import Player from "../components/conversation/comment/player";
import TweetEmbed from "../components/conversation/comment/twitter";
//import { LinkPreview } from "@dhaiwat10/react-link-preview";
/**
 * @param {any} node
 */
export function replace(node) {
    var _a, _b, _c, _d;
    const domNode = node;
    if (domNode.attribs) {
        try {
            if (domNode.name === "a") {
                const href = (_a = domNode.attribs) === null || _a === void 0 ? void 0 : _a.href;
                if ([
                    /https:\/\/(www|m)\.facebook\.com\/.+\/videos\/\S+/i,
                    /https:\/\/fb\.watch\/\S+/i,
                    /https:\/\/(www|m)\.youtube\.com\/watch\?v=\S{11}(|&\S+)/i,
                    /https:\/\/youtu.be\/\S{11}/i,
                ].some((item) => href.match(item))) {
                    return (_jsxs("div", { children: [_jsx(Player, { url: href }), domToReact([node])] }));
                }
                else if (href.match(/https:\/\/(|mobile.)twitter.com\/\S+\/status\/\S+/i)) {
                    const url = new URL(href);
                    const tweetid = url.pathname.split("/").pop();
                    if (tweetid)
                        return (_jsxs("div", { children: [_jsx(TweetEmbed, { tweetId: tweetid }), domToReact([node])] }));
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
                const firstChild = (_b = domNode.children) === null || _b === void 0 ? void 0 : _b[0];
                if (((_c = domNode.children) === null || _c === void 0 ? void 0 : _c.length) === 1 &&
                    (firstChild === null || firstChild === void 0 ? void 0 : firstChild.name) === "img" &&
                    (firstChild === null || firstChild === void 0 ? void 0 : firstChild.attribs)) {
                    const { src, height, width, style } = firstChild.attribs;
                    if (src && domNode.attribs.href === src) {
                        return (_jsx("a", Object.assign({ href: domNode.attribs.href, onClick: (evt) => {
                                evt.preventDefault();
                            } }, { children: _jsx(Img, { src: src, height: height, width: width, style: style }) })));
                    }
                }
            }
            if (domNode.name === "img" && ((_d = domNode.attribs) === null || _d === void 0 ? void 0 : _d.src)) {
                const { src, height, width, style } = domNode.attribs;
                return (_jsx("a", Object.assign({ href: src, target: "_blank", rel: "noopener noreferrer", onClick: (e) => {
                        e.preventDefault();
                    } }, { children: _jsx(Img, { src: src, height: height, width: width, style: style }) })));
            }
        }
        catch (_e) { }
    }
}
//# sourceMappingURL=modifycomments.js.map