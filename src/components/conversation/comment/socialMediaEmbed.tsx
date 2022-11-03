import { Box } from "@mui/material";
import { FacebookEmbed, InstagramEmbed, TwitterEmbed } from "react-social-media-embed";
import { regex } from "../../../lib/regex";
import { useWidth } from "../../AppContextProvider";

export default function SocialMediaEmbed(props: { url: string }) {
    const { url } = props;
    const [width] = useWidth();
    const Element = [
        {
            element: <InstagramEmbed url={url} width={width < 760 ? "100%" : "55%"} />,
            regex: regex.instagram,
        },
        {
            element: (
                <FacebookEmbed
                    url={url}
                    width={width < 760 ? "100%" : "55%"}
                    height={350}
                />
            ),
            regex: regex.facebook.posts,
        },
        {
            element: (
                <TwitterEmbed
                    url={url}
                    width={width < 760 ? "100%" : "55%"}
                    height={350}
                />
            ),
            regex: regex.twitter,
        },
    ].find((item) => item.regex.some((regex) => url.match(regex)))?.element;

    if (!Element) return null;

    return <Box>{Element}</Box>;
}
