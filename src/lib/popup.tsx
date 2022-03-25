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
  title: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  button?: { text: string; link: string };
  children: JSX.Element | JSX.Element[];
}) {
  return (
    <Dialog
      open={props.open}
      PaperProps={{
        sx: {
          backgroundImage: "none",
          backgroundColor: "primary.main",
        },
      }}
    >
      <DialogTitle className="nopadding flex mt5 mb5 popup-dialogtitle">
        <p
          style={{
            marginLeft: "20px",
            marginTop: 0,
            marginBottom: 0,
          }}
        >
          {props.title}
        </p>
        <IconButton
          className="mr5"
          onClick={() => {
            props.setOpen(false);
          }}
        >
          <Close sx={{ color: "white", fontSize: "18px" }} />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent className="nopadding">
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            fontSize: "20px",
            marginTop: "5px",
            marginBottom: "5px",
            textAlign: "center",
          }}
        >
          {props.children}
        </div>
        {props.button && <Divider />}
        {props.button && (
          <Link className="notextdecoration" to={props.button.link}>
            <Button
              className="notexttransform font-size-18"
              color="secondary"
              variant="text"
              fullWidth
            >
              {props.button.text}
            </Button>
          </Link>
        )}
      </DialogContent>
    </Dialog>
  );
}
