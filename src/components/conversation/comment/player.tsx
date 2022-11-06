import { Box, IconButton, Tooltip } from "@mui/material";
import React, { useRef, useState } from "react";
import YoutubePlayer from "react-player/youtube";
import FacebookPlayer from "react-player/facebook";
import StreamPlayer from "react-player/streamable";
import {
    Close,
    Facebook,
    Fullscreen,
    PictureInPictureAlt,
    PlayArrow,
    PlayCircleOutline,
    YouTube as YouTubeIcon,
} from "@mui/icons-material";
import screenfull from "screenfull";
import { findDOMNode } from "react-dom";
import { regex } from "../../../lib/regex";
import { useWidth } from "../../AppContextProvider";

export default function Player(props: { url: string; style?: React.CSSProperties }) {
    const [pip, setPip] = useState(false);
    const [play, setPlay] = useState(false);
    const [width] = useWidth();
    const YoutubePlayerRef = useRef<YoutubePlayer>(null);
    const FacebookPlayerRef = useRef<FacebookPlayer>(null);
    const StreamPlayerRef = useRef<StreamPlayer>(null);

    const { url, style } = props;

    const mode =
        (regex.facebook.videos.some((regexp) => regexp.test(url)) && "facebook") ||
        (regex.youtube.some((regexp) => regexp.test(url)) && "youtube") ||
        "streamable";

    const buttons = [
        {
            title: "Full Screen (press ESC/F11 to exit)",
            icon: <Fullscreen className="!text-[18px]" />,
            onClick: () => {
                const Player = findDOMNode(
                    {
                        youtube: YoutubePlayerRef,
                        facebook: FacebookPlayerRef,
                        streamable: StreamPlayerRef,
                    }[mode].current
                );
                Player instanceof Element && screenfull.request(Player);
            },
        },
        {
            title: "Picture in Picture",
            icon: <PictureInPictureAlt className="!text-[16px]" />,
            onClick: () => {
                setPip(!pip);
            },
            hidden: !{
                youtube: YoutubePlayer,
                facebook: FacebookPlayer,
                streamable: StreamPlayer,
            }[mode].canEnablePIP(url),
        },
        {
            title: "Close",
            icon: <Close className="!text-[16px]" />,
            onClick: () => {
                setPlay(false);
            },
        },
    ];

    const commonProps = {
        width: window.innerWidth < 760 ? "100%" : "65%",
        height: "auto",
        className: "aspect-video",
        stopOnUnmount: false,
        pip,
        url,
        controls: true,
        light: !play,
        onClickPreview: () => {
            setPlay(true);
        },
        playing: play,
    };

    return (
        <Box className="!mb-[5px]" style={style}>
            {play && (
                <Box
                    width={width < 760 ? "100%" : "65%"}
                    sx={{ bgcolor: "#333", height: 30 }}
                    className="!text-metahkg-grey !text-[15px] flex justify-between items-center"
                >
                    <Box className="flex items-center !ml-[10px]">
                        {
                            {
                                youtube: <YouTubeIcon className="!text-[18px]" />,
                                facebook: <Facebook className="!text-[18px]" />,
                                streamable: <PlayArrow className="!text-[18px]" />,
                            }[mode]
                        }
                        <p className="!my-0 !ml-[5px]">
                            {
                                {
                                    youtube: "Youtube",
                                    facebook: "Facebook",
                                    streamable: "Streamable",
                                }[mode]
                            }
                        </p>
                    </Box>
                    <Box className="flex items-center !mr-[5px]">
                        {buttons.map(
                            (btn) =>
                                !btn.hidden && (
                                    <Tooltip title={btn.title} arrow>
                                        <IconButton onClick={btn.onClick}>
                                            {btn.icon}
                                        </IconButton>
                                    </Tooltip>
                                )
                        )}
                    </Box>
                </Box>
            )}
            {
                {
                    youtube: (
                        <YoutubePlayer
                            ref={YoutubePlayerRef}
                            {...commonProps}
                            playIcon={
                                <img
                                    width={80}
                                    height={50}
                                    src="/images/youtube/youtube.png"
                                    alt=""
                                />
                            }
                        />
                    ),
                    facebook: (
                        <FacebookPlayer
                            ref={FacebookPlayerRef}
                            {...commonProps}
                            playIcon={<PlayCircleOutline className="!text-[50px]" />}
                        />
                    ),
                    streamable: (
                        <StreamPlayer
                            ref={StreamPlayerRef}
                            {...commonProps}
                            playIcon={<PlayArrow className="!text-[50px]" />}
                        />
                    ),
                }[mode]
            }
        </Box>
    );
}
