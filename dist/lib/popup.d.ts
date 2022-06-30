import React from "react";
import type { SxProps } from "@mui/system/styleFunctionSx";
import type { Theme } from "@mui/system";
export declare function PopUp(props: {
    title?: string;
    closeBtn?: boolean;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    buttons?: {
        text: string;
        link: string;
    }[];
    children: JSX.Element | JSX.Element[];
    fullScreen?: boolean;
    fullWidth?: boolean;
    sx?: SxProps<Theme>;
    className?: string;
}): JSX.Element;
