import React from "react";
import {
  ContentCopy,
  Telegram,
  WhatsApp,
  Link as LinkIcon,
  Facebook,
  Twitter,
  Reddit,
} from "@mui/icons-material";
import { IconButton, TextField, Tooltip } from "@mui/material";
import { PopUp } from "../../lib/popup";
import { useNotification, useWidth } from "../ContextProvider";
import { useShareLink, useShareOpen, useShareTitle } from "../ShareProvider";
import Gab from "../../lib/icons/gab";
export default function Share() {
  const [title] = useShareTitle();
  const [link] = useShareLink();
  const [open, setOpen] = useShareOpen();
  const text = title + "\n" + link + "\n- Shared from Metahkg forum";
  const [, setNotification] = useNotification();
  const [width] = useWidth();
  type external = {
    icon: JSX.Element;
    title: string;
    link: string;
  };
  const externals: external[] = [
    {
      icon: <Telegram />,
      title: "Share to Telegram",
      link: `tg://msg_url?text=${encodeURIComponent(
        title + "\n- Shared from Metahkg forum"
      )}&url=${encodeURIComponent(link)}`,
    },
    {
      icon: <WhatsApp />,
      title: "Share to WhatsApp",
      link: `whatsapp://send?text=${encodeURIComponent(text)}`,
    },
    {
      icon: <Twitter />,
      title: "Share to Twitter",
      link: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
    },
    {
      icon: <Reddit />,
      title: "Share to Reddit",
      link: `https://www.reddit.com/submit?link=${encodeURIComponent(
        link
      )}&title=${encodeURIComponent(title)}`,
    },
    {
      icon: <Facebook />,
      title: "Share to Facebook",
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
    },
    {
      icon: <Gab white />,
      title: "Share to Gab",
      link: `https://gab.com/compose?text=${encodeURIComponent(text)}`,
    },
  ];
  return (
    <PopUp
      withbutton={false}
      open={open}
      setOpen={setOpen}
      title="Share"
      button={{ text: "", link: "" }}
    >
      <div className="ml10 mr10 text-align-start">
        <TextField
          className="mt0"
          sx={{
            minWidth: width < 760 ? "300px" : "500px",
          }}
          multiline
          variant="outlined"
          fullWidth
          aria-readonly
          value={text}
        />
        <div className="mt5">
          <Tooltip arrow title="Copy">
            <IconButton
              onClick={async () => {
                await navigator.clipboard.writeText(link);
                setNotification({ open: true, text: "Copied to Clipboard!" });
              }}
            >
              <ContentCopy />
            </IconButton>
          </Tooltip>
          <Tooltip arrow title="Copy link">
            <IconButton
              onClick={async () => {
                await navigator.clipboard.writeText(link);
                setNotification({
                  open: true,
                  text: "Link copied to Clipboard!",
                });
              }}
            >
              <LinkIcon />
            </IconButton>
          </Tooltip>
          {externals.map((external) => (
            <Tooltip arrow title={external.title}>
              <a href={external.link} target="_blank" rel="noreferrer">
                <IconButton>{external.icon}</IconButton>
              </a>
            </Tooltip>
          ))}
        </div>
      </div>
    </PopUp>
  );
}
