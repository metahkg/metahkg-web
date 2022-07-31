import "../../../css/components/conversation/comment/commentBody.css";
import { replace } from "../../../lib/domReplace";
import parse from "html-react-parser";
import React, { useEffect, useMemo, useState } from "react";
import Prism from "prismjs";
import { Box, Button } from "@mui/material";
import CommentPopup from "../../../lib/commentPopup";
import { Comment } from "@metahkg/api";
import { useSettings } from "../../ContextProvider";
import { filterSwearWords } from "../../../lib/filterSwear";

export default function CommentBody(props: {
    comment: Comment;
    depth: number;
    noQuote?: boolean;
    maxHeight?: string | number;
}) {
    const { comment, depth, noQuote, maxHeight } = props;
    const [settings] = useSettings();
    const [quoteOpen, setQuoteOpen] = useState(false);
    const [showQuote, setShowQuote] = useState(!(depth && depth % 4 === 0));

    const [commentJSX, setCommentJSX] = useState(
        parse(
            settings.filterSwearWords
                ? filterSwearWords(comment.comment)
                : comment.comment,
            { replace: replace({ quote: depth > 0 }) }
        )
    );

    useEffect(() => {
        setCommentJSX(
            parse(
                settings.filterSwearWords
                    ? filterSwearWords(comment.comment)
                    : comment.comment,
                { replace: replace({ quote: depth > 0 }) }
            )
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings.filterSwearWords]);

    const content = useMemo(
        () => [
            comment.quote && !noQuote && (
                <blockquote
                    key={0}
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
                                    showQuote &&
                                    `2px solid ${theme.palette.secondary.main}`,
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
            <React.Fragment key={1}>{commentJSX}</React.Fragment>,
        ],
        [comment.quote, commentJSX, depth, noQuote, showQuote]
    );

    useEffect(() => {
        Prism.highlightAll();
    });

    return (
        <React.Fragment key={depth}>
            {comment.quote && showQuote && (
                <CommentPopup
                    open={quoteOpen}
                    setOpen={setQuoteOpen}
                    comment={comment.quote}
                    fetchComment
                />
            )}
            {depth === 0 ? (
                <Box
                    className={maxHeight ? "overflow-auto" : ""}
                    style={{
                        maxHeight,
                    }}
                >
                    <Box
                        className={`novmargin comment-body fullwidth break-word-force font-size-16`}
                    >
                        {content}
                    </Box>
                </Box>
            ) : (
                content
            )}
        </React.Fragment>
    );
}
