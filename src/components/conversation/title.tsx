import "./css/title.css";
import React from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Share as ShareIcon,
  Reply as ReplyIcon,
} from "@mui/icons-material";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useHistory } from "../ContextProvider";
import { useShareLink, useShareOpen, useShareTitle } from "../ShareProvider";
/*
 * Thread title component
 * category: category of the thread'
 * title: title of the thread
 * slink: shortened link of the thread
 * renders: a link arrow to the previous category / search / profile / history,
 * or if this is the first page of this session, /category/>category id>
 * title beside the arrow
 * comment (/comment) and share buttons at the right
 * share button opens a popup
 */
export default function Title(props: {
  category: number;
  title: string;
  slink: string;
}) {
  const { category, title, slink } = props;
  const [shareOpen, setShareOpen] = useShareOpen();
  const [shareTitle, setShareTitle] = useShareTitle();
  const [shareLink, setShareLink] = useShareLink();
  const [history] = useHistory();
  const params = useParams();
  return (
    <Box
      className="title-root"
      sx={{
        bgcolor: "primary.main",
      }}
    >
      <div className="flex ml10 mr20 align-center justify-space-between fullheight">
        <div className="flex align-center mr10 overflow-hidden">
          {(history || category) && (
            <Link to={history || `/category/${category}`}>
              <IconButton className="nomargin nopadding">
                <ArrowBackIcon color="secondary" />
              </IconButton>
            </Link>
          )}
          <Typography
            className="novmargin ml10 overflow-hidden text-overflow-ellipsis nowrap title-text"
            sx={{
              color: "secondary.main",
            }}
          >
            {title}
          </Typography>
        </div>
        <Box className="flex">
          <Tooltip title="Comment" arrow>
            <Link className="notextdecoration" to={`/comment/${params.id}`}>
              <IconButton>
                <ReplyIcon className="white title-reply" />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip title="Share" arrow>
            <IconButton
              onClick={() => {
                !shareOpen && setShareOpen(true);
                shareTitle !== title && setShareTitle(title);
                shareLink !== slink && setShareLink(slink);
              }}
            >
              <ShareIcon className="white title-share" />
            </IconButton>
          </Tooltip>
        </Box>
      </div>
    </Box>
  );
}
