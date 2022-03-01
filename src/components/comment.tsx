import "./css/comment.css";
import React, { memo } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Reply as ReplyIcon } from "@mui/icons-material";
import parse from "html-react-parser";
import date from "date-and-time";
import { timetoword } from "../lib/common";
import VoteButtons from "./votebuttons";
import { PopUp } from "../lib/popup";
import { useState } from "react";
import { useNavigate } from "react-router";
/*
 * Comment component renders a comment
 * which includes a title (Tag)
 * the comment body
 * and upvote and downvote buttons
 */
function Comment(props: {
  op: boolean; //is original poster (true | false)
  sex: "M" | "F"; //user sex
  id: number; //comment id
  tid: number; //thread id
  userid: number; //user's id
  name: string; //username
  children: string; //the comment
  date: string; //comment date
  up: number; //number of upvotes
  down: number; //number of downvotes
  vote?: "U" | "D"; //user's vote, if not voted or not signed in it would be undefined
}) {
  /*
   * Tag serves as a title for the comment
   * renders user id, username (as children),
   * and a quote button for users to quote the comment
   */
  function Tag(tprops: { children: string | JSX.Element | JSX.Element[] }) {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    return (
      <div className="flex align-center font-size-16 pt10">
        <PopUp
          withbutton
          open={open}
          setOpen={setOpen}
          title="User information"
          button={{ text: "View Profile", link: `/profile/${props.userid}` }}
        >
          <p className="text-align-center mt5 mb5">
            {props.name}
            <br />#{props.userid}
          </p>
        </PopUp>
        <p
          className="novmargin"
          style={{
            color: props.op ? "#f5bd1f" : "#aca9a9",
          }}
        >
          #{props.id}
        </p>
        <p
          className="comment-tag-userlink novmargin ml10 text-overflow-ellipsis nowrap pointer overflow-hidden max-width-full"
          onClick={() => {
            setOpen(true);
          }}
          style={{
            color: props.sex === "M" ? "#34aadc" : "red",
          }}
        >
          {tprops.children}
        </p>
        <Tooltip
          title={date.format(new Date(props.date), "ddd, MMM DD YYYY HH:mm:ss")}
          arrow
        >
          <p className="novmargin metahkg-grey ml10 font-size-15">
            {timetoword(props.date)}
          </p>
        </Tooltip>
        <Tooltip title="Quote" arrow>
          <IconButton
            className="ml10 nopadding"
            onClick={() => {
              localStorage.reply = props.children;
              navigate(`/comment/${props.tid}`);
            }}
          >
            <ReplyIcon className="metahkg-grey-force font-size-19-force" />
          </IconButton>
        </Tooltip>
      </div>
    );
  }
  return (
    <Box
      id={`c${props.id}`}
      className="text-align-left mt5"
      sx={{
        backgroundColor: "primary.main",
      }}
    >
      <div className="ml20 mr20">
        <Tag>{props.name}</Tag>
        <p className="mt10 mb10">{parse(props.children)}</p>
        <div className="comment-internal-spacer" />
      </div>
      <div className="ml20">
        <VoteButtons
          key={props.tid}
          vote={props.vote}
          id={props.tid}
          cid={props.id}
          up={props.up}
          down={props.down}
        />
      </div>
      <div className="comment-spacer" />
    </Box>
  );
}
export default memo(Comment);
