import React from "react";
import { BrokenImage } from "@mui/icons-material";
import { Box, Tooltip } from "@mui/material";
import { css } from "../../../lib/css";

export default class ImageErrorBoundary extends React.Component<{
    src: string;
    children: JSX.Element;
}> {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        const { src } = this.props;
        if (this.state.hasError) {
            return (
                <Tooltip
                    arrow
                    title={
                        <a
                            className={`${css.link} !text-white`}
                            href={src}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {src}
                        </a>
                    }
                >
                    <Box className="cursor-pointer inline-block">
                        <img src={src} alt="" className="hidden" />
                        <BrokenImage />
                    </Box>
                </Tooltip>
            );
        }
        return this.props.children;
    }
}
