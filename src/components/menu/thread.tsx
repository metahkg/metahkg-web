import React from "react";
import "./css/thread.css";
import { Button, Box } from "@mui/material";
import {
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Article as ArticleIcon,
  Comment as CommentIcon,
} from "@mui/icons-material";
import { timetoword, roundup, summary } from "../../lib/common";
import { Link } from "react-router-dom";
import { useCat, useId, useProfile, useSearch } from "../MenuProvider";
/*
 * A thread in the menu
 * Basic information about the thread is needed (see type summary in ../../lib/common)
 * category of the current menu is needed to decide whether category lebel is rendered or not
 */
export default function MenuThread(props: { thread: summary }) {
  const [cat] = useCat();
  const [search] = useSearch();
  const [profile] = useProfile();
  const [id] = useId();
  const { thread } = props;
  return (
    <Link
      className="fullwidth notextdecoration"
      to={`/thread/${thread.id}?page=1`}
    >
      <Box
        className={`flex fullwidth flex-dir-column menuthread-root${
          id === thread.id ? "-selected" : ""
        }`}
      >
        <div className="flex fullwidth align-center justify-space-between menuthread-top">
          <div style={{ display: "flex", alignItems: "center" }}>
            <p
              className="font-size-16 ml20 metahkg-grey menuthread-op"
              style={{
                color: thread.sex === "M" ? "#0277bd" : "red",
              }}
            >
              {thread.op}
            </p>
            <p className="ml5 nomargin metahkg-grey font-size-13 menuthread-toptext">
              {timetoword(thread.lastModified)}
            </p>
          </div>
          <div className="flex align-center">
            {thread.vote >= 0 ? (
              <ThumbUpIcon className="metahkg-grey ml5 font-size-13-force menuthread-icons" />
            ) : (
              <ThumbDownIcon className="metahkg-grey ml5 font-size-13-force menuthread-icons" />
            )}
            <p className="nomargin metahkg-grey font-size-13 menuthread-toptext">
              {thread.vote}
            </p>
            <CommentIcon className="metahkg-grey ml5 font-size-13-force menuthread-icons" />
            <p className="nomargin metahkg-grey font-size-13 menuthread-toptext">
              {thread.c}
            </p>
            <ArticleIcon className="metahkg-grey ml5 font-size-13-force menuthread-icons" />
            <p className="mr10 nomargin metahkg-grey font-size-13 menuthread-toptext">
              {String(roundup(thread.c / 25))}
            </p>
          </div>
        </div>
        <div className="flex fullwidth mb10 align-center justify-space-between menuthread-bottom">
          <p className="ml20 nomargin font-size-16 overflow-hidden text-overflow-ellipsis text-align-left menuthread-title">
            {thread.title}
          </p>
          {!!(cat === 1 || search || profile) && (
            <Link
              className="mr10 notextdecoration"
              to={`/category/${thread.category}`}
            >
              <Button
                variant="contained"
                className="nomargin nopadding notexttransform menuthread-catbtn"
              >
                <p className="nomargin font-size-12 menuthread-catname">
                  {thread.catname}
                </p>
              </Button>
            </Link>
          )}
        </div>
      </Box>
    </Link>
  );
}
