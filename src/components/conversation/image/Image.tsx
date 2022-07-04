import React, { Suspense } from "react";
import { useImage } from "react-image";
import ImageErrorBoundary from "./ImageErrorBoundary";
import { PhotoView } from "react-photo-view";
import { toJSON } from "@wc-yat/csstojson/dist/toJSON";
import prettier from "prettier/standalone";
import prettierCss from "prettier/parser-postcss";
import Loader from "../../../lib/loader";

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
            <img
                src={src}
                alt=""
                height={height}
                width={width}
                style={
                    style
                        ? toJSON(
                              prettier
                                  .format(style, {
                                      parser: "css",
                                      plugins: [prettierCss],
                                  })
                                  .replaceAll("\n", "")
                          ).attributes
                        : undefined
                }
                loading="lazy"
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
                    <Loader
                        position="flex-start"
                        className="mt5 mb5"
                        sxProgress={{ color: "darkgrey" }}
                        thickness={2}
                        size={50}
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
