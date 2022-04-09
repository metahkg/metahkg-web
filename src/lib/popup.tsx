import "./css/popup.css";
import React from "react";
import { Close } from "@mui/icons-material";
import { Button, Dialog, DialogContent, DialogTitle, Divider, IconButton } from "@mui/material";
import { Link } from "react-router-dom";

export function PopUp(props: { title: string; open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>>; button?: { text: string; link: string }; children: JSX.Element | JSX.Element[]; fullScreen?: boolean }) {
    return (
        <Dialog
            open={props.open}
            fullScreen={props.fullScreen}
            PaperProps={{
                sx: {
                    backgroundImage: "none",
                    bgcolor: "primary.main",
                },
            }}
        >
            <DialogTitle className="nopadding flex mt5 mb5 popup-dialogtitle">
                <p className="ml20 novmargin">{props.title}</p>
                <IconButton
                    className="mr5"
                    onClick={() => {
                        props.setOpen(false);
                    }}
                >
                    <Close className="font-size-18-force" />
                </IconButton>
            </DialogTitle>
            <Divider />
            <DialogContent className="nopadding">
                <div className="fullwidth flex justify-center text-align-center font-size-20 mt5 mb5">{props.children}</div>
                {props.button && <Divider />}
                {props.button && (
                    <Link className="notextdecoration" to={props.button.link}>
                        <Button className="notexttransform font-size-18-force" color="secondary" variant="text" fullWidth>
                            {props.button.text}
                        </Button>
                    </Link>
                )}
            </DialogContent>
        </Dialog>
    );
}
