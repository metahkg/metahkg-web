import "./css/votebuttons.css";
import React from "react";
interface Props {
    commentId: number;
    upVoteCount: number;
    downVoteCount: number;
}
declare const VoteBar: React.NamedExoticComponent<Props>;
export default VoteBar;
