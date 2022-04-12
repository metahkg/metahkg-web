import { useState } from "react";
import Spinner from "react-spinner-material";
import { TwitterTweetEmbed } from "react-twitter-embed";

export default function TweetEmbed(props: { tweetId: string }) {
    const { tweetId } = props;
    const [loading, setLoading] = useState(true);
    return (
        <div>
            {loading && (
                <Spinner
                    className="mt5 mb5"
                    radius={50}
                    color="gray"
                    stroke={3}
                    visible={true}
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
        </div>
    );
}
