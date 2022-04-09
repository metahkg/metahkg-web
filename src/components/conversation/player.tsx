import { Box, IconButton, Tooltip } from "@mui/material";
import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import {
  Close,
  Facebook,
  Fullscreen,
  PictureInPictureAlt,
  PlayCircleOutline,
  YouTube as YouTubeIcon,
} from "@mui/icons-material";
import screenfull from "screenfull";
import { findDOMNode } from "react-dom";

export default function Player(props: { url: string }) {
  const [pip, setPip] = useState(false);
  const [play, setPlay] = useState(false);
  const player = useRef<ReactPlayer>(null);
  const { url } = props;
  const mode =
    ([/https:\/\/fb\.watch\/\.+/i, /https:\/\/(www|m)\.facebook\.com\/.+\/videos\/\S+/i].some((regexp) =>
      url.match(regexp)
    ) &&
      "facebook") ||
    "youtube";
  const buttons = [
    {
      title: "Full Screen (press ESC/F11 to exit)",
      icon: <Fullscreen className="font-size-18-force" />,
      onClick: () => {
        //@ts-ignore
        screenfull.request(findDOMNode(player.current));
      },
    },
    {
      title: "Picture in Picture",
      icon: <PictureInPictureAlt className="font-size-16-force" />,
      onClick: () => {
        setPip(!pip);
      },
      hidden: !ReactPlayer.canEnablePIP(url),
    },
    {
      title: "Close",
      icon: <Close className="font-size-16-force" />,
      onClick: () => {
        setPlay(false);
      },
    },
  ];
  return (
    <div className="mb5">
      {play && (
        <Box
          width={window.innerWidth < 760 ? "100%" : "65%"}
          sx={{ bgcolor: "#333", height: 30 }}
          className="metahkg-grey-force font-size-15-force flex justify-space-between align-center"
        >
          <div className="flex align-center ml10">
            {
              {
                youtube: <YouTubeIcon className="font-size-18-force" />,
                facebook: <Facebook className="font-size-18-force" />,
              }[mode]
            }
            <p className="novmargin ml5">{{ youtube: "Youtube", facebook: "Facebook" }[mode]}</p>
          </div>
          <div className="flex align-center mr5">
            {buttons.map(
              (btn) =>
                !btn.hidden && (
                  <Tooltip title={btn.title} arrow>
                    <IconButton onClick={btn.onClick}>{btn.icon}</IconButton>
                  </Tooltip>
                )
            )}
          </div>
        </Box>
      )}
      <ReactPlayer
        ref={player}
        width={window.innerWidth < 760 ? "100%" : "65%"}
        height="auto"
        style={{ aspectRatio: "16/9" }}
        stopOnUnmount={false}
        pip={pip}
        url={url}
        controls
        light={!play}
        onClickPreview={() => {
          setPlay(true);
        }}
        playIcon={
          {
            youtube: <img width={80} height={50} src="/images/youtube/youtube.png" alt="" />,
            facebook: <PlayCircleOutline className="font-size-50-force" />,
          }[mode]
        }
        playing={play}
      />
    </div>
  );
}
