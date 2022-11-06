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

import { Box, ImageList, ImageListItem } from "@mui/material";
import React, { useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { imagesApi } from "../../lib/common";
import Loader from "../../lib/loader";
import { PopUp } from "../../lib/popup";
import { useWidth } from "../AppContextProvider";

export default function Gallery(props: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    images: { src: string }[];
}) {
    const { open, setOpen, images } = props;
    const [width] = useWidth();
    const [loading, setLoading] = useState(true);
    return (
        <PopUp title="Images" open={open} setOpen={setOpen} fullScreen>
            <Box sx={{ bgcolor: "primary.main" }} className="!ml-[10px] !mr-[10px]">
                <PhotoProvider>
                    {loading && <Loader position="center" />}
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
                        gap={5}
                    >
                        {images.map((item) => {
                            const src = `${imagesApi}/${item.src}`;
                            return (
                                <PhotoView src={src} key={src}>
                                    <ImageListItem className="cursor-pointer" key={src}>
                                        <img
                                            src={`${imagesApi}/300x300/${item.src}`}
                                            alt=""
                                            loading="lazy"
                                            onLoad={() => {
                                                loading && setLoading(false);
                                            }}
                                        />
                                    </ImageListItem>
                                </PhotoView>
                            );
                        })}
                    </ImageList>
                </PhotoProvider>
            </Box>
        </PopUp>
    );
}
