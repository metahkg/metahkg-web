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
                        className="pr0 pl0 flex !pt-[5px] !pb-[5px] justify-between items-center"
                    >
                        <p className="!ml-[20px] !my-0">{title}</p>
                        <IconButton className="!mr-[5px]" onClick={handleClose}>
                            <Close className="!text-[18px]" />
                        </IconButton>
                    </DialogTitle>
                    <Divider />
                </React.Fragment>
            )}
            <DialogContent className="!p-0">
                <Box
                    className={`w-full flex flex-col justify-center text-center ${
                        title ? "!mt-[5px]" : ""
                    } ${buttons?.length ? "!mb-[5px]" : ""}`}
                >
                    {children}
                </Box>
                {!!buttons?.length && (
                    <React.Fragment>
                        <Divider />
                        <Box className="flex w-full">
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
                                            className="!normal-case !text-[18px] !no-underline w-full"
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
