import { Box, IconButton } from "@mui/material";
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
  return (
    <div>
        <Box
          sx={{ bgcolor: "primary.light", height: 20 }}
          className="metahkg-grey justify-space-between"
        >
          <div className="flex">
            <YouTubeIcon />
            <p>Youtube</p>
          </div>
          <div className="flex">
            <IconButton
              onClick={() => {
                // @ts-ignore
                screenfull.request(findDOMNode(player));
              }}
            >
              <Fullscreen />
            </IconButton>
            <IconButton
              onClick={() => {
                setPip(true);
              }}
            >
              <PictureInPictureAlt />
            </IconButton>
            <IconButton
              onClick={() => {
                setPlay(false);
              }}
            >
              <Close />
            </IconButton>
          </div>
        </Box>
      <ReactPlayer
        ref={player}
        width={window.innerWidth < 760 ? "100%" : "60%"}
        height="auto"
        style={{ aspectRatio: "16/9" }}
        stopOnUnmount={false}
        pip={pip}
        url={`https://youtu.be/${videoId}`}
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
      />
    </div>
  );
}
