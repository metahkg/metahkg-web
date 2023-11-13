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

import { LinkPreview } from "@metahkg/react-link-preview";
import { Box } from "@mui/material";
import { DOMNode, domToReact } from "html-react-parser";
import React, { useState } from "react";
import Loader from "../../../lib/loader";
import { Client as RLPCLient } from "@metahkg/rlp-proxy-rewrite-api";
import axios from "axios";
import { useDarkMode, useServerConfig } from "../../AppContextProvider";

export function ReactLinkPreview(props: {
    quote?: boolean;
    url: string;
    node: DOMNode;
    originalUrl?: string;
    signature?: string;
}) {
    const { quote, url, node, originalUrl, signature } = props;
    const [success, setSuccess] = useState(true);
    const darkMode = useDarkMode();
    const [serverConfig] = useServerConfig();

    return success ? (
        <Box
            sx={{
                "& .Container, & .Container *:hover, & .LowerContainer, & .LowerContainer:hover, & .LinkPreview, & .LinkPreview:hover, & .LinkPreview *, & .LinkPreview *:hover":
                    {
                        backgroundColor: darkMode
                            ? "#333 !important"
                            : "#f6f6f6 !important",
                    },
                "& .Container": {
                    maxWidth: `${quote ? 400 : 450}px !important`,
                },
                [`& .Title${quote ? ", & .Description" : ""}`]: {
                    whiteSpace: "whitespace-nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                },
                ...(quote && {
                    "& .Description": {
                        display: "inline-block",
                    },
                }),
            }}
        >
            <LinkPreview
                url={url}
                height={quote ? 200 : 280}
                imageHeight={250}
                width={"100%"}
                className="!mt-[5px] !mb-[5px] LinkPreview"
                borderColor={darkMode ? "#333" : "#f6f6f6"}
                backgroundColor={darkMode ? "#333" : "#f6f6f6"}
                primaryTextColor={darkMode ? "white" : "black"}
                secondaryTextColor="#aca9a9"
                titleLength={50}
                descriptionLength={60}
                fetcher={async () => {
                    try {
                        const client = new RLPCLient(
                            `https://${
                                serverConfig?.domains.rlpProxy || "rlp.metahkg.org"
                            }`,
                            axios.create(),
                        );
                        const data = await client.getMetadata(
                            encodeURIComponent(originalUrl || url),
                            signature,
                        );
                        const { metadata } = data;
                        if (!metadata?.title || !metadata?.hostname) {
                            setSuccess(false);
                        }
                        if (metadata?.image && metadata?.image_signature) {
                            metadata.image = `https://${serverConfig?.domains.images}/s${metadata.image_signature}/${metadata.image}`;
                        }
                        return metadata;
                    } catch (err) {
                        console.log(err);
                        setSuccess(false);
                        return null;
                    }
                }}
                customLoader={
                    <Loader
                        position="flex-start"
                        className="!mt-[5px] !mb-[5px]"
                        sxProgress={{ color: "darkgrey" }}
                        thickness={2}
                        size={50}
                    />
                }
                showPlaceholderIfNoImage
                imageProxy=""
            />
            {domToReact([node])}
        </Box>
    ) : (
        <React.Fragment>{domToReact([node])}</React.Fragment>
    );
}
