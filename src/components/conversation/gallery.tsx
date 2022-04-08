import {Box, ImageList, ImageListItem} from "@mui/material";
import React from "react";
import {PhotoProvider, PhotoView} from "react-photo-view";
import {PopUp} from "../../lib/popup";
import {useWidth} from "../ContextProvider";

export default function Gallery(props: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    images: { src: string }[];
}) {
    const {open, setOpen, images} = props;
    const resizeBase = "https://i.metahkg.org/resize";
    const [width] = useWidth();
    return (
        <PopUp title="Images" open={open} setOpen={setOpen} fullScreen>
            <Box sx={{bgcolor: "primary.main"}}>
                <PhotoProvider>
                    <ImageList
                        className="flex justify-center"
                        variant="standard"
                        cols={
                            (width < 500 && 2) ||
                            (width < 800 && 3) ||
                            (width < 1100 && 4) ||
                            (width < 1400 && 5) ||
                            6
                        }
                        gap={8}
                    >
                        {images.map((item) => (
                            <PhotoView src={item.src} key={item.src}>
                                <ImageListItem className="pointer" key={item.src}>
                                    <img
                                        src={`${resizeBase}?src=${encodeURIComponent(
                                            item.src
                                        )}&height=300&fit=cover`}
                                        srcSet={`${resizeBase}?src=${encodeURIComponent(
                                            item.src
                                        )}&height=300&fit=cover 2x`}
                                        alt=""
                                        loading="lazy"
                                    />
                                </ImageListItem>
                            </PhotoView>
                        ))}
                    </ImageList>
                </PhotoProvider>
            </Box>
        </PopUp>
    );
}
