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
/**
 * It's a component that renders the title of the thread.
 * @param {number} props.category The category of the thread
 * @param {string} props.title The title of of the thread
 * @param {string} props.slink The shortened link of the thread
 */
export default function Title(props: {
  /** thread category id */
  category: number | undefined;
  /** thread title */
  title: string | undefined;
  /** thread shortened link */
  slink: string | undefined;
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
            className="novmargin ml10 overflow-hidden text-overflow-ellipsis nowrap font-size-18-force title-text"
            sx={{
              color: "secondary.main",
            }}
          >
            {title}
          </Typography>
        </div>
        {Boolean(title && slink) && (
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
                  shareTitle !== title && title && setShareTitle(title);
                  shareLink !== slink && slink && setShareLink(slink);
                }}
              >
                <ShareIcon className="white font-size-20-force title-share" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </div>
    </Box>
  );
}
