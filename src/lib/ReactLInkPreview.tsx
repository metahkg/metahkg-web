import { LinkPreview } from "@dhaiwat10/react-link-preview";
import { Box } from "@mui/material";
import axios from "axios";
import { DOMNode, domToReact } from "html-react-parser";
import React, { useState } from "react";
import Loader from "./loader";

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
                    try {
                        const { data } = await axios.get(
                            `https://rlp.metahkg.org/v2?url=${url}`
                        );
                        const { metadata } = data;
                        if (!metadata.title || !metadata.image || !metadata.description) {
                            setSuccess(false);
                        }
                        return metadata;
                    } catch {
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
            />
            {domToReact([node])}
        </Box>
    ) : (
        <React.Fragment>{domToReact([node])}</React.Fragment>
    );
}
