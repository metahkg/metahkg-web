import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import React from "react";

export interface AlertDialogProps {
    open: boolean;
    setOpen: (x: boolean) => void;
    title: string;
    message: string;
    btns: { text: string; action: () => void }[];
    onClose?: () => void;
}

export default function AlertDialog(props: AlertDialogProps) {
    const { open, setOpen, title, message, btns, onClose } = props;
    const closeDialog = () => {
        setOpen(false);
        onClose && onClose();
    };
    return (
        <Dialog
            color={"primary"}
            open={open}
            fullWidth
            onClose={closeDialog}
            onKeyDown={(e) => {
                if (e.key === "Escape" || e.key === "Enter") closeDialog();
            }}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
                <DialogActions>
                    {btns?.length ? (
                        btns.map((btn) => (
                            <Button
                                color={"secondary"}
                                onClick={() => {
                                    btn.action();
                                    closeDialog();
                                }}
                            >
                                {btn.text}
                            </Button>
                        ))
                    ) : (
                        <Button onClick={closeDialog}>OK</Button>
                    )}
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
}
