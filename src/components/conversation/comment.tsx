import "./css/comment.css";
import React, { memo, useEffect } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import {
  Feed as FeedIcon,
  Reply as ReplyIcon,
  Share as ShareIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import parse from "html-react-parser";
import dateat from "date-and-time";
import { timetoword } from "../../lib/common";
import VoteButtons from "../votebuttons";
import { PopUp } from "../../lib/popup";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useShareLink, useShareOpen, useShareTitle } from "../ShareProvider";
import axios from "axios";
import { useNotification } from "../ContextProvider";
import MoreList from "./more";
import { isMobile } from "react-device-detect";
import { useTid, useTitle, useStory } from "../conversation";
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
  /** comment share link */
  slink?: string;
}) {
  const { op, sex, id, userid, name, children, date, up, down, vote, slink } =
    props;
  const tid = useTid();
  const title = useTitle();
  const [story, setStory] = useStory();
  /**
   * Tag serves as a title for the comment
   * renders user id, username (as children),
   * and a quote button for users to quote the comment
   */
  function Tag(tprops: { children: string | JSX.Element | JSX.Element[] }) {
    const [open, setOpen] = useState(false);
    const [timemode, setTimemode] = useState<"short" | "long">("short");
    const [link, setLink] = useState(slink);
    const [, setShareLink] = useShareLink();
    const [, setShareTitle] = useShareTitle();
    const [, setShareOpen] = useShareOpen();
    const [, setNotification] = useNotification();
    const navigate = useNavigate();
    useEffect(() => {
      if (!slink) {
        axios
          .post("https://api-us.wcyat.me/create", {
            url: `${window.location.origin}/thread/${tid}?c=${id}`,
          })
          .then((res) => {
            setLink(`https://l.wcyat.me/${res.data.id}`);
          })
          .catch(() => {
            setNotification({
              open: true,
              text: "Unable to generate shortened link. A long link will be used instead.",
            });
          });
      }
    }, [setNotification, setShareLink]);
    const leftbtns = [
      {
        icon: story ? (
          <VisibilityOff className="metahkg-grey-force font-size-18-force" />
        ) : (
          <Visibility className="metahkg-grey-force font-size-18-force" />
        ),
        title: story ? "Quit story mode" : "Story mode",
        action: () => {
          setStory(story ? 0 : userid);
          story && setTimeout(() => {
            document.getElementById(`c${id}`)?.scrollIntoView();
          }, 10);
        },
      },
      {
        icon: <ReplyIcon className="metahkg-grey-force font-size-20-force" />,
        title: "Quote",
        action: () => {
          navigate(`/comment/${tid}?quote=${id}`);
        },
      },
    ];
    const rightbtns: {
      icon: JSX.Element;
      title: string;
      action: () => void;
    }[] = [
      {
        icon: <ShareIcon className="metahkg-grey-force font-size-18-force" />,
        title: "Share",
        action: () => {
          setShareLink(
            link || `${window.location.origin}/thread/${tid}?c=${id}`
          );
          setShareTitle(title + ` - comment #${id}`);
          setShareOpen(true);
        },
      },
    ];
    const morelist: { icon: JSX.Element; title: string; action: () => void }[] =
      [
        {
          icon: <FeedIcon className="font-size-18-force" />,
          title: "Create new topic",
          action: () => {
            navigate(`/create?quote=${tid}.${id}`);
          },
        },
      ];
    return (
      <div className="flex align-center font-size-16 pt10 justify-space-between">
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
        <div className="flex align-center">
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
            <p
              onClick={() => {
                if (isMobile) {
                  setTimemode(timemode === "short" ? "long" : "short");
                }
              }}
              className={`novmargin metahkg-grey ml10 font-size-15${
                isMobile ? " pointer" : ""
              }`}
            >
              {
                {
                  short: timetoword(date),
                  long: dateat.format(new Date(date), "DD/MM/YY HH:mm"),
                }[timemode]
              }
            </p>
          </Tooltip>
          {leftbtns.map((button) => (
            <Tooltip title={button.title} arrow>
              <IconButton className="ml10 nopadding" onClick={button.action}>
                {button.icon}
              </IconButton>
            </Tooltip>
          ))}
        </div>
        <div className="flex align-center">
          {rightbtns.map((button) => (
            <Tooltip title={button.title} arrow>
              <IconButton className="ml10 nopadding" onClick={button.action}>
                {button.icon}
              </IconButton>
            </Tooltip>
          ))}
          <MoreList buttons={morelist} />
        </div>
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
        <p className="mt10 mb10 comment-body break-word-force">
          {parse(children)}
        </p>
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