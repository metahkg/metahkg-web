import React, { Suspense } from "react";
import Img from "react-cool-img";
import Spinner from "react-spinner-material";
import { useImage } from "react-image";
import { CSSstring } from "../../lib/cssstring";
import ImageErrorBoundary from "./ImageErrorBoundary";
import { PhotoView } from "react-photo-view";

function ImgComponent(props: {
    src: string;
    height?: string;
    width?: string;
    style?: string;
}) {
    const { height, style, width } = props;
    const { src } = useImage({ srcList: props.src });
    return (
        <PhotoView src={src}>
            <Img
                src={src}
                alt=""
                style={CSSstring(String(style))}
                height={height}
                width={width}
                lazy
            />
        </PhotoView>
    );
}

export default function Image(props: {
    src: string;
    height?: string;
    width?: string;
    style?: string;
}) {
    const { height, style, width, src } = props;
    return (
        <Suspense
            fallback={
                <a href={src} target="_blank" rel="noreferrer">
                    <Spinner
                        className="mt5 mb5"
                        radius={50}
                        color="gray"
                        stroke={3}
                        visible={true}
                    />
                </a>
            }
        >
            <ImageErrorBoundary src={src}>
                <ImgComponent src={src} height={height} width={width} style={style} />
            </ImageErrorBoundary>
        </Suspense>
    );
}
