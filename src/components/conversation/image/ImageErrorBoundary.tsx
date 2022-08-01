import React from "react";
import { BrokenImage } from "@mui/icons-material";
import { Box, Tooltip } from "@mui/material";

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
                            className="link white-force"
                            href={src}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {src}
                        </a>
                    }
                >
                    <Box className="pointer display-inline-block">
                        <img src={src} alt="" className="display-none" />
                        <BrokenImage />
                    </Box>
                </Tooltip>
            );
        }
        return this.props.children;
    }
}
