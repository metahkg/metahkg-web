import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, IconButton, Tooltip } from "@mui/material";
import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Close, Facebook, Fullscreen, PictureInPictureAlt, PlayCircleOutline, YouTube as YouTubeIcon, } from "@mui/icons-material";
import screenfull from "screenfull";
import { findDOMNode } from "react-dom";
export default function Player(props) {
    const [pip, setPip] = useState(false);
    const [play, setPlay] = useState(false);
    const player = useRef(null);
    const { url } = props;
    const mode = ([
        /https:\/\/fb\.watch\/\S+/i,
        /https:\/\/(www|m)\.facebook\.com\/.+\/videos\/\S+/i,
    ].some((regexp) => url.match(regexp)) &&
        "facebook") ||
        "youtube";
    const buttons = [
        {
            title: "Full Screen (press ESC/F11 to exit)",
            icon: _jsx(Fullscreen, { className: "font-size-18-force" }),
            onClick: () => {
                const Player = findDOMNode(player.current);
                Player instanceof Element && screenfull.request(Player);
            },
        },
        {
            title: "Picture in Picture",
            icon: _jsx(PictureInPictureAlt, { className: "font-size-16-force" }),
            onClick: () => {
                setPip(!pip);
            },
            hidden: !ReactPlayer.canEnablePIP(url),
        },
        {
            title: "Close",
            icon: _jsx(Close, { className: "font-size-16-force" }),
            onClick: () => {
                setPlay(false);
            },
        },
    ];
    return (_jsxs("div", Object.assign({ className: "mb5" }, { children: [play && (_jsxs(Box, Object.assign({ width: window.innerWidth < 760 ? "100%" : "65%", sx: { bgcolor: "#333", height: 30 }, className: "metahkg-grey-force font-size-15-force flex justify-space-between align-center" }, { children: [_jsxs("div", Object.assign({ className: "flex align-center ml10" }, { children: [{
                                youtube: _jsx(YouTubeIcon, { className: "font-size-18-force" }),
                                facebook: _jsx(Facebook, { className: "font-size-18-force" }),
                            }[mode], _jsx("p", Object.assign({ className: "novmargin ml5" }, { children: { youtube: "Youtube", facebook: "Facebook" }[mode] }))] })), _jsx("div", Object.assign({ className: "flex align-center mr5" }, { children: buttons.map((btn) => !btn.hidden && (_jsx(Tooltip, Object.assign({ title: btn.title, arrow: true }, { children: _jsx(IconButton, Object.assign({ onClick: btn.onClick }, { children: btn.icon })) })))) }))] }))), _jsx(ReactPlayer, { ref: player, width: window.innerWidth < 760 ? "100%" : "65%", height: "auto", style: { aspectRatio: "16/9" }, stopOnUnmount: false, pip: pip, url: url, controls: true, light: !play, onClickPreview: () => {
                    setPlay(true);
                }, playIcon: {
                    youtube: (_jsx("img", { width: 80, height: 50, src: "/images/youtube/youtube.png", alt: "" })),
                    facebook: _jsx(PlayCircleOutline, { className: "font-size-50-force" }),
                }[mode], playing: play })] })));
}
//# sourceMappingURL=player.js.map