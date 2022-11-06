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

import React, { Suspense, useEffect, useRef, useState } from "react";
import { useImage } from "react-image";
import ImageErrorBoundary from "./ImageErrorBoundary";
import { PhotoView } from "react-photo-view";
import Loader from "../../../lib/loader";
import { Box, IconButton } from "@mui/material";
import { ZoomInMap, ZoomOutMap } from "@mui/icons-material";
import { useCRoot } from "../ConversationContext";
import cssToReact from "../../../lib/cssToReact";
import { imagesApi } from "../../../lib/common";
// import { engineName, isIOS, isSafari } from "react-device-detect";

interface Props {
    src: string;
    height?: string | number;
    width?: string | number;
    style?: string;
    small?: boolean;
}

function ImgComponent(props: Props) {
    const { height, style, width } = props;
    const { src } = useImage({ srcList: `${imagesApi}/${props.src}` });
    const [small, setSmall] = useState(props.small || false);
    const [disableResize, setDisableResize] = useState(false);
    const cRoot = useCRoot();
    const imgRef = useRef<HTMLImageElement>(null);
    const [reRender, setReRender] = useState(false);

    const smallMaxH = 250;
    const smallMaxW = 250;
    const maxW = 800;

    const checkCanResize = () => {
        //if (isIOS || isSafari || engineName === "Webkit") return;

        const img = imgRef.current;
        if (img) {
            const { width, height } = img;
            if (
                (width < smallMaxW && height < smallMaxH) ||
                (!small && width <= smallMaxW && height <= smallMaxH)
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
            <Box
                className={`relative ${
                    imgRef.current &&
                    cRoot.current &&
                    // TODO: should not hard code
                    imgRef.current.clientWidth < cRoot.current.clientWidth - 40
                        ? "inline-block"
                        : ""
                }`}
            >
                {!disableResize && (
                    <IconButton
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSmall(!small);
                        }}
                        className={"!rounded-[10px] !absolute"}
                        sx={{
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
                    width={Number(height) > maxW ? "auto" : width}
                    style={{
                        ...(style && cssToReact(style)),
                        ...(small && {
                            maxWidth: smallMaxW,
                            maxHeight: smallMaxH,
                        }),
                    }}
                    loading="lazy"
                    ref={imgRef}
                    onLoad={() => {
                        checkCanResize();
                        setReRender(!reRender);
                    }}
                />
            </Box>
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
                    <a
                        href={src}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block"
                    >
                        <Loader
                            position="flex-start"
                            className="!m-[5px]"
                            sxProgress={{ color: "darkgrey" }}
                            thickness={2}
                            size={45}
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
