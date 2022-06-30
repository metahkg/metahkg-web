import { jsx as _jsx } from "react/jsx-runtime";
import { Box, ImageList, ImageListItem } from "@mui/material";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { PopUp } from "../../lib/popup";
import { useWidth } from "../ContextProvider";
export default function Gallery(props) {
    const { open, setOpen, images } = props;
    const resizeBase = "https://i.metahkg.org/resize";
    const [width] = useWidth();
    return (_jsx(PopUp, Object.assign({ title: "Images", open: open, setOpen: setOpen, fullScreen: true }, { children: _jsx(Box, Object.assign({ sx: { bgcolor: "primary.main" } }, { children: _jsx(PhotoProvider, { children: _jsx(ImageList, Object.assign({ className: "flex justify-center", variant: "standard", cols: (width < 500 && 2) ||
                        (width < 800 && 3) ||
                        (width < 1100 && 4) ||
                        (width < 1400 && 5) ||
                        6, gap: 8 }, { children: images.map((item) => (_jsx(PhotoView, Object.assign({ src: item.src }, { children: _jsx(ImageListItem, Object.assign({ className: "pointer" }, { children: _jsx("img", { src: `${resizeBase}?src=${encodeURIComponent(item.src)}&height=300&width=300&fit=cover`, srcSet: `${resizeBase}?src=${encodeURIComponent(item.src)}&height=300&width=300&fit=cover 2x`, alt: "", loading: "lazy" }) }), item.src) }), item.src))) })) }) })) })));
}
//# sourceMappingURL=gallery.js.map