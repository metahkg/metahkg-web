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

export function ReactLinkPreview(props: { quote?: boolean; url: string; node: DOMNode }) {
    const { quote, url, node } = props;
    const [success, setSuccess] = useState(true);
    return success ? (
        <Box
            sx={{
                "& .Container, & .Container *:hover, & .LowerContainer, & .LowerContainer:hover, & .LinkPreview, & .LinkPreview:hover, & .LinkPreview *, & .LinkPreview *:hover":
                    {
                        backgroundColor: "#333 !important",
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
                borderColor="#555"
                backgroundColor="#333"
                primaryTextColor="white"
                secondaryTextColor="#aca9a9"
                descriptionLength={60}
                fetcher={async (url: string) => {
                    console.log(url);
                    try {
                        const client = new RLPCLient(
                            `https://${
                                process.env.REACT_APP_RLP_PROXY_DOMAIN ||
                                "rlp.metahkg.org"
                            }`,
                            axios.create()
                        );
                        const data = await client.getMetadata(encodeURIComponent(url));
                        const { metadata } = data;
                        if (!metadata?.title || !metadata?.hostname) {
                            setSuccess(false);
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
                imageProxy={`https://${
                    process.env.REACT_APP_IMAGES_DOMAIN || "i.metahkg.org"
                }`}
            />
            {domToReact([node])}
        </Box>
    ) : (
        <React.Fragment>{domToReact([node])}</React.Fragment>
    );
}
