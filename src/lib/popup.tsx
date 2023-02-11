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
    Typography,
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
    onClose?: () => void;
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
        onClose,
    } = props;
    const handleClose = () => {
        setOpen(false);
        onClose?.();
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
                className: `!rounded-lg ${className}`,
            }}
            fullWidth={fullWidth}
            onClose={handleClose}
        >
            {(title || closeBtn) && (
                <React.Fragment>
                    <DialogTitle
                        sx={{ bgcolor: "primary.main" }}
                        className="!px-0 !py-1 !min-w-[270px] flex justify-between items-center"
                    >
                        <Typography className="!ml-5" variant="h6">
                            {title}
                        </Typography>
                        <IconButton className="!mr-1" onClick={handleClose}>
                            <Close className="!text-lg" />
                        </IconButton>
                    </DialogTitle>
                    <Divider />
                </React.Fragment>
            )}
            <DialogContent className="!p-0">
                <Box
                    className={`w-full flex flex-col justify-center text-center ${
                        title ? "!mt-1" : ""
                    } ${buttons?.length ? "!mb-1" : ""}`}
                >
                    {children}
                </Box>
                {Boolean(buttons?.length) && (
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
                                            className="!normal-case !text-lg !no-underline w-full"
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
