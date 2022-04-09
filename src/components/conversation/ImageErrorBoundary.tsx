import React from "react";
import { BrokenImage } from "@mui/icons-material";
import { Tooltip } from "@mui/material";

export default class ImageErrorBoundary extends React.Component<{
    src: string;
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
                        <a className="link white-force" href={src} target="_blank" rel="noreferrer">
                            {src}
                        </a>
                    }
                >
                    <div className="pointer display-inline-block">
                        <img src={src} alt="" className="display-none" />
                        <BrokenImage />
                    </div>
                </Tooltip>
            );
        }
        return this.props.children;
    }
}
