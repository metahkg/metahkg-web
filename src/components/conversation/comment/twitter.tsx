import { useEffect, useRef, useState } from "react";
import Spinner from "react-spinner-material";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { useCRoot, useThread } from "../ConversationContext";

export default function TweetEmbed(props: { tweetId: string }) {
    const { tweetId } = props;
    const [loading, setLoading] = useState(true);
    const prevLoading = useRef(loading);
    const beforeHeight = useRef(0);
    const [thread] = useThread();
    const croot = useCRoot();
    const [shouldScroll, setShouldScroll] = useState(false);

    if (prevLoading.current && !loading) {
        const commentEle = document.getElementById(`c${thread?.conversation[0].id}`);
        if (commentEle && croot.current) {
            beforeHeight.current = commentEle?.offsetTop - 47 - croot.current?.scrollTop;
            setShouldScroll(true);
        }
    }

    prevLoading.current = loading;

    useEffect(() => {
        if (shouldScroll) {
            setShouldScroll(false);
            const commentEle = document.getElementById(`c${thread?.conversation[0].id}`);
            if (croot.current && commentEle) {
                const afterHeight = commentEle?.offsetTop - 47 - croot.current?.scrollTop;
                console.log(croot.current.scrollTop, afterHeight - beforeHeight.current);
                croot.current.scrollTop += afterHeight - beforeHeight.current;
            }
        }
    }, [croot, shouldScroll, thread?.conversation]);

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
