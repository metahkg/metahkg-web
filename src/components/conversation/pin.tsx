import { InfoOutlined } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { commentType } from "../../types/conversation/comment";
import React, { useState } from "react";
import CommentPopup from "../../lib/commentPopup";

export default function PinnedComment(props: { comment: commentType }) {
    const { comment } = props;
    const [open, setOpen] = useState(false);
    return (
        <React.Fragment>
            <CommentPopup comment={comment} open={open} setOpen={setOpen} fetchComment />
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
                        {comment.text}
                    </Typography>
                </div>
            </Box>
        </React.Fragment>
    );
}
