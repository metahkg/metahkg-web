import React, { Suspense, useEffect, useRef, useState } from "react";
import { useImage } from "react-image";
import ImageErrorBoundary from "./ImageErrorBoundary";
import { PhotoView } from "react-photo-view";
import { toJSON } from "@wc-yat/csstojson/dist/toJSON";
import prettier from "prettier/standalone";
import prettierCss from "prettier/parser-postcss";
import Loader from "../../../lib/loader";
import { IconButton } from "@mui/material";
import { ZoomInMap, ZoomOutMap } from "@mui/icons-material";
import { useCRoot } from "../ConversationContext";
import { engineName, isIOS, isSafari } from "react-device-detect";

interface Props {
    src: string;
    height?: string | number;
    width?: string | number;
    style?: string;
    small?: boolean;
}

function ImgComponent(props: Props) {
    const { height, style, width } = props;
    const { src } = useImage({ srcList: props.src });
    const [small, setSmall] = useState(props.small || false);
    const [disableResize, setDisableResize] = useState(false);
    const cRoot = useCRoot();
    const imgRef = useRef<HTMLImageElement>(null);
    const [reRender, setReRender] = useState(false);

    const checkCanResize = () => {
        if (isIOS || isSafari || engineName === "Webkit") return;

        const img = imgRef.current;
        if (img) {
            const { width, height } = img;
            if (
                (width < 200 && height < 200) ||
                (!small && width <= 200 && height <= 200)
            )
                setDisableResize(true);
        }
    };

    useEffect(() => {
        checkCanResize();
        setReRender(!reRender);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [small]);

    return (
        <PhotoView src={src}>
            <div
                style={{
                    position: "relative",
                    ...(imgRef.current &&
                        cRoot.current &&
                        // TODO: should not hard code
                        imgRef.current.clientWidth < cRoot.current.clientWidth - 40 && {
                            display: "inline-block",
                        }),
                }}
            >
                {!disableResize && (
                    <IconButton
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSmall(!small);
                        }}
                        className={"border-radius-10-force"}
                        sx={{
                            position: "absolute",
                            bgcolor: "primary.main",
                            "&:hover": {
                                bgcolor: "primary.dark",
                                opacity: 0.9,
                            },
                            right: 10,
                            bottom: 10,
                            opacity: 0.6,
                        }}
                    >
                        {small ? <ZoomOutMap /> : <ZoomInMap />}
                    </IconButton>
                )}
                <img
                    src={src}
                    alt=""
                    className={"block"}
                    height={height}
                    width={Number(height) > 800 ? "auto" : width}
                    style={{
                        ...(style &&
                            toJSON(
                                prettier
                                    .format(style, {
                                        parser: "css",
                                        plugins: [prettierCss],
                                    })
                                    .replaceAll("\n", "")
                            ).attributes),
                        ...(small && {
                            maxWidth: 200,
                            maxHeight: 200,
                        }),
                    }}
                    loading="lazy"
                    ref={imgRef}
                    onLoad={() => {
                        checkCanResize();
                        setReRender(!reRender);
                    }}
                />
            </div>
        </PhotoView>
    );
}

export default function Image(props: Props) {
    const { src } = props;
    return (
        <a
            href={src}
            target={"_blank"}
            rel={"noreferrer"}
            onClick={(e) => {
                e.preventDefault();
            }}
        >
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
                    <ImgComponent {...props} />
                </ImageErrorBoundary>
            </Suspense>
        </a>
    );
}
