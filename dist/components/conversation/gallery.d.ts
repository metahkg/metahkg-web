import React from "react";
export default function Gallery(props: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    images: {
        src: string;
    }[];
}): JSX.Element;
