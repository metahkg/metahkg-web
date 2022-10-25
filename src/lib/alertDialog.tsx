import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import React, { useState } from "react";
import { useAlertDialog } from "../components/ContextProvider";

export interface AlertDialogProps {
    open: boolean;
    setOpen: (x: boolean) => void;
    title: string;
    message?: string;
    body?: (
        state: { [key: string]: any },
        setState: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>,
        closeDialog: () => void
    ) => React.ReactNode;
    btns: (
        state: { [key: string]: any },
        setState: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>,
        closeDialog: () => void
    ) => {
        text: string;
        action: (
            state: { [key: string]: any },
            setState: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>,
            closeDialog: () => void
        ) => void;
        disabled?: boolean;
    }[];
    onClose?: (
        state: { [key: string]: any },
        setState: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>
    ) => void;
}

export default function AlertDialog(props: AlertDialogProps) {
    const { open, setOpen, title, message, onClose, body } = props;
    const [alertDialog, setAlertDialog] = useAlertDialog();
    const [state, setState] = useState<{ [key: string]: any }>({});
    const closeDialog = () => {
        setOpen(false);
        setTimeout(() => {
            setAlertDialog({
                open: false,
                setOpen: (x) => {
                    setAlertDialog({ ...alertDialog, open: x });
                },
                title: "",
                message: "",
                btns: () => [],
            });
        });
        setState({});
        onClose?.(state, setState);
    };

    const btns = props.btns(state, setState, closeDialog);

    return (
        <Dialog
            color="primary"
            className="!bg-none rounded-[20px]"
            open={open}
            fullWidth
            onClose={closeDialog}
            onKeyDown={(e) => {
                if (e.key === "Escape" || e.key === "Enter") closeDialog();
            }}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {message && <DialogContentText>{message}</DialogContentText>}
                {body?.(state, setState, closeDialog)}
                <DialogActions>
                    {btns?.length ? (
                        btns.map((btn) => (
                            <Button
                                color={"secondary"}
                                onClick={() => {
                                    btn.action(state, setState, closeDialog);
                                    closeDialog();
                                }}
                                disabled={btn.disabled}
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
