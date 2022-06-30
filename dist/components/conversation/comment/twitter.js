import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import Spinner from "react-spinner-material";
import { TwitterTweetEmbed } from "react-twitter-embed";
export default function TweetEmbed(props) {
    const { tweetId } = props;
    const [loading, setLoading] = useState(true);
    return (_jsxs("div", { children: [loading && (_jsx(Spinner, { className: "mt5 mb5", radius: 50, color: "gray", stroke: 3, visible: true })), _jsx(TwitterTweetEmbed, { options: {
                    theme: "dark",
                }, tweetId: tweetId, onLoad: () => {
                    setLoading(false);
                } })] }));
}
//# sourceMappingURL=twitter.js.map