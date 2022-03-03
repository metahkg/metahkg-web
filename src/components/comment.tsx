import "./css/comment.css";
import React, { memo } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Reply as ReplyIcon } from "@mui/icons-material";
import parse from "html-react-parser";
import dateat from "date-and-time";
import { timetoword } from "../lib/common";
import VoteButtons from "./votebuttons";
import { PopUp } from "../lib/popup";
import { useState } from "react";
import { useNavigate } from "react-router";
/**
 * Comment component renders a comment
 * which includes a title (Tag)
 * the comment body
 * and upvote and downvote buttons
 * @param {boolean} props.op whether the comment user is op
 * @param {"M" | "F"} props.sex comment user sex
 * @param {number} props.id comment id
 * @param {number} props.tid thread id
 * @param {number} props.userid comment user id
 * @param {string} props.date created date
 * @param {number} props.up number of upvotes
 * @param {number} props.down number of downvotes
 * @param {string | undefined} props.vote user(client)'s vote
 * @param {string} props.children the comment
 * @returns a comment
 */
function Comment(props: {
  /** is comment user original poster */
  op: boolean;
  /** comment user's sex */
  sex: "M" | "F";
  /** comment id */
  id: number;
  /** thread id */
  tid: number;
  /** comment user's id */
  userid: number;
  /** comment username */
  name: string;
  /** the comment (in stringified html) */
  children: string;
  /** comment created date */
  date: string;
  /** number of upvotes */
  up: number;
  /** number of downvotes */
  down: number;
  /** comment user's vote' */
  vote?: "U" | "D";
}) {
  const { op, sex, id, tid, userid, name, children, date, up, down, vote } =
    props;
  /**
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
          button={{ text: "View Profile", link: `/profile/${userid}` }}
        >
          <p className="text-align-center mt5 mb5">
            {name}
            <br />#{userid}
          </p>
        </PopUp>
        <p
          className="novmargin"
          style={{
            color: op ? "#f5bd1f" : "#aca9a9",
          }}
        >
          #{id}
        </p>
        <p
          className="comment-tag-userlink novmargin ml10 text-overflow-ellipsis nowrap pointer overflow-hidden max-width-full"
          onClick={() => {
            setOpen(true);
          }}
          style={{
            color: sex === "M" ? "#34aadc" : "red",
          }}
        >
          {tprops.children}
        </p>
        <Tooltip
          title={dateat.format(new Date(date), "ddd, MMM DD YYYY HH:mm:ss")}
          arrow
        >
          <p className="novmargin metahkg-grey ml10 font-size-15">
            {timetoword(date)}
          </p>
        </Tooltip>
        <Tooltip title="Quote" arrow>
          <IconButton
            className="ml10 nopadding"
            onClick={() => {
              localStorage.reply = children;
              navigate(`/comment/${tid}`);
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
      id={`c${id}`}
      className="text-align-left mt6"
      sx={{
        bgcolor: "primary.main",
      }}
    >
      <div className="ml20 mr20">
        <Tag>{name}</Tag>
        <p className="mt10 mb10">{parse(children)}</p>
        <div className="comment-internal-spacer" />
      </div>
      <div className="ml20">
        <VoteButtons
          key={tid}
          vote={vote}
          id={tid}
          cid={id}
          up={up}
          down={down}
        />
      </div>
      <div className="comment-spacer" />
    </Box>
  );
}
export default memo(Comment);
