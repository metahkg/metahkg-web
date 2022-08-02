import React from "react";
import { Close } from "@mui/icons-material";
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import type { SxProps } from "@mui/system/styleFunctionSx";
import type { Theme } from "@mui/system";

export function PopUp(props: {
    title?: string;
    closeBtn?: boolean;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    buttons?: ({ text: string; link?: string; action?: () => void } | undefined)[];
    children: JSX.Element | JSX.Element[];
    fullScreen?: boolean;
    fullWidth?: boolean;
    sx?: SxProps<Theme>;
    className?: string;
}) {
    const {
        title,
        open,
        setOpen,
        buttons,
        children,
        fullScreen,
        fullWidth,
        sx,
        className,
        closeBtn,
    } = props;
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <Dialog
            open={open}
            fullScreen={fullScreen}
            PaperProps={{
                sx: {
                    backgroundImage: "none",
                    bgcolor: "primary.main",
                    ...sx,
                },
                className: className,
            }}
            fullWidth={fullWidth}
            onClose={handleClose}
        >
            {(title || closeBtn) && (
                <React.Fragment>
                    <DialogTitle
                        sx={{ minWidth: 270, bgcolor: "primary.main" }}
                        className="pr0 pl0 flex pt5 pb5 justify-space-between align-center"
                    >
                        <p className="ml20 novmargin">{title}</p>
                        <IconButton className="mr5" onClick={handleClose}>
                            <Close className="font-size-18-force" />
                        </IconButton>
                    </DialogTitle>
                    <Divider />
                </React.Fragment>
            )}
            <DialogContent className="nopadding">
                <Box
                    className={`fullwidth flex flex-dir-column justify-center text-align-center ${
                        title ? "mt5" : ""
                    } ${buttons?.length ? "mb5" : ""}`}
                >
                    {children}
                </Box>
                {!!buttons?.length && (
                    <React.Fragment>
                        <Divider />
                        <Box className="flex fullwidth">
                            {buttons?.map(
                                (button, index) =>
                                    button && (
                                        <Button
                                            key={index}
                                            {...(button.link && {
                                                component: Link,
                                                to: button.link,
                                            })}
                                            onClick={button.action}
                                            className="notexttransform font-size-18-force notextdecoration fullwidth"
                                            sx={(theme) => ({
                                                color: `${theme.palette.secondary.main} !important`,
                                            })}
                                            color="secondary"
                                            variant="text"
                                            fullWidth
                                        >
                                            {button.text}
                                        </Button>
                                    )
                            )}
                        </Box>
                    </React.Fragment>
                )}
            </DialogContent>
        </Dialog>
    );
}
