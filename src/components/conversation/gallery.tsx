import { Box } from "@mui/material";
import React from "react";
import ImageGallery from "react-image-gallery";
import { PopUp } from "../../lib/popup";
export default function Gallery(props: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  images: { original: string; thumbnail: string }[];
}) {
  const { open, setOpen, images } = props;
  return (
    <PopUp title="Images" open={open} setOpen={setOpen}>
      <Box sx={{ bgcolor: "primary.main" }}>
        <ImageGallery items={images} />
      </Box>
    </PopUp>
  );
}
