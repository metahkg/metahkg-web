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
                className="flex w-full items-center cursor-pointer"
                onClick={() => {
                    setOpen(true);
                }}
            >
                <InfoOutlined className="!text-metahkg-grey !ml-[10px] !mr-[10px]" />
                <Box className="overflow-hidden">
                    <Typography className="!my-0" color="secondary">
                        Pinned Comment #{comment.id}
                    </Typography>
                    <Typography className="!text-metahkg-grey text-ellipsis overflow-hidden whitespace-nowrap !my-0 !mr-[15px]">
                        {settings.filterSwearWords
                            ? filterSwearWords(comment.text)
                            : comment.text}
                    </Typography>
                </Box>
            </Box>
        </React.Fragment>
    );
}
