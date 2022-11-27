/*
 Copyright (C) 2022-present Metahkg Contributors

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
    ].find((item) => item.regex.some((regex) => regex.test(url)))?.element;

    if (!Element) return null;

    return <Box>{Element}</Box>;
}
