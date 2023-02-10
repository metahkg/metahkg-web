/*
 Copyright (C) 2022-present Metahkg Contributors

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Comment } from "@metahkg/api";
import { InfoOutlined } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import CommentPopup from "../../lib/commentPopup";
import { filterSwearWords } from "../../lib/filterSwear";
import { useSettings } from "../AppContextProvider";

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
                <InfoOutlined className="!text-metahkg-grey !mx-2" />
                <Box className="overflow-hidden">
                    <Typography className="!my-0" color="secondary">
                        Pinned Comment #{comment.id}
                    </Typography>
                    <Typography className="!text-metahkg-grey text-ellipsis overflow-hidden whitespace-nowrap !mr-4">
                        {settings.filterSwearWords
                            ? filterSwearWords(comment.text)
                            : comment.text}
                    </Typography>
                </Box>
            </Box>
        </React.Fragment>
    );
}
