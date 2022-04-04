import { Box, IconButton, Tooltip } from "@mui/material";
import { useRef, useState } from "react";
import ReactPlayer from "react-player/youtube";
import {
  Close,
  Fullscreen,
  PictureInPictureAlt,
  YouTube as YouTubeIcon,
} from "@mui/icons-material";
import screenfull from "screenfull";
import { findDOMNode } from "react-dom";
export default function Youtube(props: { videoId: string }) {
  const [pip, setPip] = useState(false);
  const [play, setPlay] = useState(false);
  const player = useRef<ReactPlayer>(null);
  const { videoId } = props;
  const videourl = `https://www.youtube.com/watch?v=${videoId}`;
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
      hidden: !ReactPlayer.canEnablePIP(videourl),
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
    <div>
      {play && (
        <Box
          width={window.innerWidth < 760 ? "100%" : "60%"}
          sx={{ bgcolor: "#333", height: 30 }}
          className="metahkg-grey-force font-size-15-force flex justify-space-between align-center"
        >
          <div className="flex align-center ml10">
            <YouTubeIcon className="font-size-18-force" />
            <p className="novmargin ml5">Youtube</p>
          </div>
          <div className="flex align-center mr5">
            {buttons.map(
              (btn) =>
                !btn.hidden && (
                  <Tooltip title={btn.title}>
                    <IconButton onClick={btn.onClick}>{btn.icon}</IconButton>
                  </Tooltip>
                )
            )}
          </div>
        </Box>
      )}
      <ReactPlayer
        ref={player}
        width={window.innerWidth < 760 ? "100%" : "60%"}
        height="auto"
        style={{ aspectRatio: "16/9" }}
        stopOnUnmount={false}
        pip={pip}
        url={videourl}
        controls
        light={!play}
        onClickPreview={() => {
          setPlay(true);
        }}
        playIcon={
          <img
            width={80}
            height={50}
            src="/images/youtube/youtube.png"
            alt=""
          />
        }
        playing={play}
      />
    </div>
  );
}
