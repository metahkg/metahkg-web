import { Box } from "@mui/material";
import { useState } from "react";
import { TwitterTweetEmbed } from "react-twitter-embed";
import Loader from "../../../lib/loader";

export default function TweetEmbed(props: { tweetId: string }) {
    const { tweetId } = props;
    const [loading, setLoading] = useState(true);
    return (
        <Box>
            {loading && (
                <Loader
                    position="flex-start"
                    className="mt5 mb5"
                    sxProgress={{ color: "darkgrey" }}
                    thickness={2}
                    size={50}
                />
            )}
            <TwitterTweetEmbed
                options={{
                    theme: "dark",
                }}
                tweetId={tweetId}
                onLoad={() => {
                    setLoading(false);
                }}
            />
        </Box>
    );
}
