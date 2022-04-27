import { InfoOutlined } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { commentType } from "../../types/conversation/comment";
// @ts-ignore
import h2p from "html2plaintext";
import React, { useState } from "react";
import { PopUp } from "../../lib/popup";
import Comment from "./comment";
import { useWidth } from "../ContextProvider";

export default function PinnedComment(props: { comment: commentType }) {
    const { comment } = props;
    const [open, setOpen] = useState(false);
    const [width] = useWidth();
    return (
        <React.Fragment>
            <PopUp
                open={open}
                setOpen={setOpen}
                fullWidth
                closeBtn
                className={`height-fullvh novmargin ${
                    width < 760 ? "nohmargin fullwidth-force" : ""
                }`}
                sx={{
                    maxHeight: "none !important",
                    bgcolor: "primary.dark",
                }}
            >
                <Comment comment={comment} noId fetchComment inPopUp />
            </PopUp>
            <Box
                sx={{ bgcolor: "primary.dark", height: 50 }}
                className="flex fullwidth align-center pointer"
                onClick={() => {
                    setOpen(true);
                }}
            >
                <InfoOutlined className="metahkg-grey-force ml10 mr10" />
                <div className="overflow-hidden">
                    <Typography className="novmargin" color="secondary">
                        Pinned Comment #{comment.id}
                    </Typography>
                    <Typography className="metahkg-grey-force text-overflow-ellipsis overflow-hidden nowrap novmargin mr15">
                        {h2p(comment.comment)}
                    </Typography>
                </div>
            </Box>
        </React.Fragment>
    );
}
