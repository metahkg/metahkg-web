import "./css/popup.css";
import React from "react";
import { Close } from "@mui/icons-material";
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";

export function PopUp(props: {
    title?: string;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    buttons?: { text: string; link: string }[];
    children: JSX.Element | JSX.Element[];
    fullScreen?: boolean;
    fullWidth?: boolean;
}) {
    const { title, open, setOpen, buttons, children, fullScreen, fullWidth } = props;
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
                },
            }}
            fullWidth={fullWidth}
            onClose={handleClose}
        >
            {title && (
                <React.Fragment>
                    <DialogTitle className="nopadding flex mt5 mb5 popup-dialogtitle">
                        <p className="ml20 novmargin">{title}</p>
                        <IconButton className="mr5" onClick={handleClose}>
                            <Close className="font-size-18-force" />
                        </IconButton>
                    </DialogTitle>
                    <Divider />
                </React.Fragment>
            )}
            <DialogContent className="nopadding">
                <div
                    className={`fullwidth flex justify-center text-align-center ${
                        title ? "mt5" : ""
                    } ${buttons?.length ? "mb5" : ""}`}
                >
                    {children}
                </div>
                {!!buttons?.length && (
                    <React.Fragment>
                        <Divider />
                        <div className="flex fullwidth">
                            {buttons?.map((button) => (
                                <Link
                                    className="notextdecoration fullwidth"
                                    to={button.link}
                                >
                                    <Button
                                        className="notexttransform font-size-18-force"
                                        color="secondary"
                                        variant="text"
                                        fullWidth
                                    >
                                        {button.text}
                                    </Button>
                                </Link>
                            ))}
                        </div>
                    </React.Fragment>
                )}
            </DialogContent>
        </Dialog>
    );
}
