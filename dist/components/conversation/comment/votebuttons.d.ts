/// <reference types="react" />
import "./css/votebuttons.css";
/**
 * It creates a button group with two buttons. One for upvotes and one for downvotes.
 * @param {"U" | "D" | undefined} props.userVote user(client)'s vote
 * @param {number} props.commentId comment id
 * @param {number} props.upVotes number of upvotes
 * @param {number} props.downVotes number of downvotes
 * @returns A button group with two buttons, one for upvote and one for downvote.
 */
export default function VoteButtons(props: {
    commentId: number;
    upVotes: number;
    downVotes: number;
}): JSX.Element;
