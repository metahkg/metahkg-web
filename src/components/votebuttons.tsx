import "./css/votebuttons.css";
import React from "react";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Button, ButtonGroup, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNotification } from "./ContextProvider";
/*
 * Buttons for voting
 * Disabled if user is not signed in
 * If upvote is clicked or has been previously clicked using a same account,
 * upvote button text color changes to green and downvote button disables.
 * For downvote, the same but color is red
 * Generates a notification in case of errors
 */
export default function VoteButtons(props: {
  vote?: "U" | "D";
  id: number;
  cid: number;
  up: number;
  down: number;
}) {
  const [vote, setVote] = useState(props.vote);
  const [up, setUp] = useState(props.up);
  const [down, setDown] = useState(props.down);
  const [, setNotification] = useNotification();
  const sendvote = (v: "U" | "D") => {
    v === "U" ? setUp(up + 1) : setDown(down + 1);
    setVote(v);
    axios
      .post("/api/vote", {
        id: Number(props.id),
        cid: Number(props.cid),
        vote: v,
      })
      .catch((err) => {
        v === "U" ? setUp(up) : setDown(down);
        setVote(undefined);
        setNotification({
          open: true,
          text: err?.response?.data?.error || err?.response?.data || "",
        });
      });
  };
  return (
      <ButtonGroup
        variant="text"
        className="vb-btn-group"
      >
        <Button
          className="nopadding vb-btn vb-btn-left"
          disabled={!localStorage.user || !!vote}
          onClick={() => {
            sendvote("U");
          }}
        >
          <Typography
            className="flex"
            sx={{
              color: vote === "U" ? "green" : "#aaa",
            }}
          >
            <ArrowDropUp className="icon-white-onhover" />
            {up}
          </Typography>
        </Button>
        <Button
          className="nopadding vb-btn vb-btn-right"
          disabled={!localStorage.user || !!vote}
          onClick={() => {
            sendvote("D");
          }}
        >
          <Typography
            className="flex"
            sx={{
              color: vote === "D" ? "red" : "#aaa",
            }}
          >
            <ArrowDropDown className="icon-white-onhover" />
            {down}
          </Typography>
        </Button>
      </ButtonGroup>
  );
}
