import { Comment } from "@metahkg/api";
import { InfoOutlined } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import CommentPopup from "../../lib/commentPopup";
import { filterSwearWords } from "../../lib/filterSwear";
import { useSettings } from "../ContextProvider";

export default function PinnedComment(props: { comment: Comment }) {
    const { comment } = props;
    const [open, setOpen] = useState(false);
    const [settings] = useSettings();
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
                        {settings.filterSwearWords
                            ? filterSwearWords(comment.text)
                            : comment.text}
                    </Typography>
                </div>
            </Box>
        </React.Fragment>
    );
}
