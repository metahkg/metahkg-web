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

import React, { useState } from "react";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { ButtonGroup, Typography } from "@mui/material";
import { useNotification, useUser } from "../../AppContextProvider";
import { api } from "../../../lib/api";
import { useThreadId, useVotes } from "../ConversationContext";
import { parseError } from "../../../lib/parseError";
import { Comment, Vote } from "@metahkg/api";
import { LoadingButton } from "@mui/lab";

export default function VoteButtons(props: { comment: Comment }) {
    const threadId = useThreadId();
    const [votes, setVotes] = useVotes();
    const [, setNotification] = useNotification();
    const [user] = useUser();
    const [comment, setComment] = useState(props.comment);
    const [voting, setVoting] = useState("");

    const vote = votes?.find((v) => v.cid === comment.id)?.vote;
    const up = comment.U || 0;
    const down = comment.D || 0;

    /**
     * It sends a vote to the server.
     * @param {Vote} vote - "U" | "D"
     */
    async function sendVote(vote: Vote) {
        setVoting(vote);
        await api
            .commentVote({ vote }, threadId, comment.id)
            .then(() => {
                // for the refetch effect to work, we need to fetch the comment again
                setComment({ ...comment, [vote]: (comment[vote] || 0) + 1 });
                votes && setVotes([...votes, { cid: comment.id, vote }]);
            })
            .catch((err) => {
                setNotification({
                    open: true,
                    severity: "error",
                    text: parseError(err),
                });
            });
        setVoting("");
    }

    return (
        <ButtonGroup variant="text" className="!rounded-[4px] !bg-[#333]">
            <LoadingButton
                className="!p-0 !m-0 !py-[2px] !min-w-0 !pl-[5.5px] !pr-[6px] !rounded-r-0 [&>span]:!mr-1 [&>span]:!ml-0"
                disabled={!user || Boolean(vote) || Boolean(voting)}
                onClick={() => {
                    sendVote("U");
                }}
                startIcon={
                    <ArrowDropUp
                        className={vote === "U" ? "text-[green]" : "text-[#aaa]"}
                    />
                }
                loading={voting === "U"}
                loadingPosition="start"
            >
                <Typography
                    className={`flex ${vote === "U" ? "text-[green]" : "text-[#aaa]"}`}
                >
                    {up}
                </Typography>
            </LoadingButton>
            <LoadingButton
                className="!p-0 !m-0 !py-[2px] !min-w-0 !pr-[10px] !rounded-l-0 [&>span]:!mr-1 [&>span]:!ml-0"
                disabled={!user || Boolean(vote) || Boolean(voting)}
                onClick={() => {
                    sendVote("D");
                }}
                startIcon={
                    <ArrowDropDown
                        className={vote === "D" ? "text-[red]" : "text-[#aaa]"}
                    />
                }
                loading={voting === "D"}
                loadingPosition="start"
            >
                <Typography
                    className={`flex ${vote === "D" ? "text-[red]" : "text-[#aaa]"}`}
                >
                    {down}
                </Typography>
            </LoadingButton>
        </ButtonGroup>
    );
}
