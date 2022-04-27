import "./css/commentBody.css";
import { replace } from "../../../lib/modifycomments";
import { commentType } from "../../../types/conversation/comment";
import parse from "html-react-parser";
import React, { useEffect, useState } from "react";
import { PopUp } from "../../../lib/popup";
import Comment from "../comment";
import Prism from "prismjs";
import { Box, Button } from "@mui/material";
import { useWidth } from "../../ContextProvider";
export default function CommentBody(props: {
    comment: commentType;
    depth: number;
    noQuote?: boolean;
}) {
    const { comment, depth, noQuote } = props;
    const commentJSX = parse(comment.comment, { replace: replace });
    const [quoteOpen, setQuoteOpen] = useState(false);
    const [showQuote, setShowQuote] = useState(!(depth && depth % 4 === 0));
    const [width] = useWidth();
    const content = [
        comment.quote && !noQuote && (
            <blockquote
                style={{ border: "none" }}
                className={`flex fullwidth${depth !== 0 ? " novmargin" : ""}`}
            >
                <Box
                    className={`${
                        showQuote ? "pointer " : ""
                    }comment-body-quote-div nopadding metahkg-grey ml0`}
                    sx={(theme) => ({
                        width: 15,
                        "&:hover": {
                            borderLeft:
                                showQuote && `2px solid ${theme.palette.secondary.main}`,
                        },
                    })}
                    onClick={() => {
                        showQuote && setQuoteOpen(true);
                    }}
                />
                {showQuote ? (
                    <div className="comment-body fullwidth">
                        <CommentBody comment={comment.quote} depth={depth + 1} />
                    </div>
                ) : (
                    <Button
                        variant="outlined"
                        sx={{
                            border: "1px solid #aca6a6",
                            "&:hover": {
                                border: "1px solid #aca6a6",
                                background: "rgba(255, 255, 255, 0.1)",
                            },
                        }}
                        className="metahkg-grey-force notexttransform pt3 pb3 pl5 pr5"
                        onClick={() => {
                            setShowQuote(true);
                        }}
                    >
                        Show more
                    </Button>
                )}
            </blockquote>
        ),
        commentJSX,
    ];
    useEffect(() => {
        Prism.highlightAll();
    });
    return (
        <React.Fragment>
            {comment.quote && showQuote && (
                <PopUp
                    open={quoteOpen}
                    setOpen={setQuoteOpen}
                    fullWidth
                    closeBtn
                    className={`height-fullvh novmargin ${
                        width < 760 ? "nohmargin fullwidth-force" : ""
                    }`}
                    sx={{
                        maxHeight: "none !important",
                        bgcolor: "primary.dark",
                    }}
                >
                    <Comment fetchComment noId comment={comment.quote} inPopUp />
                </PopUp>
            )}
            {depth === 0 ? (
                <p className="novmargin comment-body fullwidth break-word-force">
                    {content}
                </p>
            ) : (
                content
            )}
        </React.Fragment>
    );
}
