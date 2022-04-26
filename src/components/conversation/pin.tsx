import { InfoOutlined } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { commentType } from "../../types/conversation/comment";
// @ts-ignore
import h2p from "html2plaintext";
import React, { useState } from "react";
import { PopUp } from "../../lib/popup";
import Comment from "./comment";
export default function PinnedComment(props: { comment: commentType }) {
    const { comment } = props;
    const [open, setOpen] = useState(false);
    return (
        <React.Fragment>
            <PopUp open={open} setOpen={setOpen} fullWidth>
                <Comment comment={comment} noId fetchComment />
            </PopUp>
            <Box
                sx={{ bgcolor: "primary.dark", height: 50 }}
                className="flex fullwidth align-center pointer"
                onClick={() => {
                    setOpen(true);
                }}
            >
                <InfoOutlined className="metahkg-grey-force ml10 mr10" />
                <div>
                    <Typography className="novmargin" color="secondary">
                        Pinned Comment #{comment.id}
                    </Typography>
                    <Typography className="metahkg-grey-force text-overflow-ellipsis overflow-hidden nowrap novmargin">
                        {h2p(comment.comment)}
                    </Typography>
                </div>
            </Box>
        </React.Fragment>
    );
}
