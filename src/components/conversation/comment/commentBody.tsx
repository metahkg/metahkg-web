/*
 Copyright (C) 2022-present Wong Chun Yat (wcyat)

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

import { useReplace } from "../../../lib/domReplace";
import parse from "html-react-parser";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import Prism from "prismjs";
// Import PrismJS theme and languages
import "prismjs/themes/prism-okaidia.css"; // Or your preferred theme
import "prismjs/components/prism-markup-templating.js"; // Required for JSX/TSX
import "prismjs/components/prism-javascript.js";
import "prismjs/components/prism-typescript.js";
import "prismjs/components/prism-jsx.js";
import "prismjs/components/prism-tsx.js";
import "prismjs/components/prism-python.js";
import "prismjs/components/prism-bash.js";
import "prismjs/components/prism-json.js";
import "prismjs/components/prism-css.js";
import "prismjs/components/prism-scss.js"; // Note: sass -> scss in prismjs
import "prismjs/components/prism-markdown.js";
import "prismjs/components/prism-mongodb.js";
import "prismjs/components/prism-sql.js";
import "prismjs/components/prism-c.js";
import "prismjs/components/prism-cpp.js";
import "prismjs/components/prism-csharp.js";
import "prismjs/components/prism-java.js";
import "prismjs/components/prism-scala.js";
import "prismjs/components/prism-kotlin.js";
import "prismjs/components/prism-swift.js";
import "prismjs/components/prism-go.js";
import "prismjs/components/prism-rust.js";
import "prismjs/components/prism-ruby.js";
import "prismjs/components/prism-php.js";
import "prismjs/components/prism-yaml.js";
// Import plugins if needed (ensure CSS for plugins like line-numbers is also handled)
// import 'prismjs/plugins/line-numbers/prism-line-numbers.js';
// import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

import { Box, Button } from "@mui/material";
import CommentPopup from "../../../lib/commentPopup";
import { Comment } from "@metahkg/api";
import { useBlockList, useSettings } from "../../AppContextProvider";
import { filterSwearWords } from "../../../lib/filterSwear";
import BlockedBtn from "./blockedBtn";
import PollComponent from "./Poll";
import { useTranslation } from "react-i18next";

import { memo } from "react";
const CommentBody = memo(function CommentBody(props: {
    comment: Comment;
    depth: number;
    noQuote?: boolean;
    maxHeight?: string | number;
}) {
    const { comment, depth, noQuote, maxHeight } = props;
    const [settings] = useSettings();
    const { t } = useTranslation();
    const [quoteOpen, setQuoteOpen] = useState(false);
    const [showQuote, setShowQuote] = useState(!(depth && depth % 4 === 0));
    const [blockList] = useBlockList();
    const [blocked, setBlocked] = useState<boolean | undefined>(
        Boolean(blockList.find((i) => i.id === comment.user.id)) || undefined
    );
    const replace = useReplace({
        quote: depth > 0,
        images: comment.images,
        links: comment.links,
    });

    useEffect(() => {
        if (blocked || blocked === undefined)
            setBlocked(
                Boolean(blockList.find((i) => i.id === comment.user.id)) || undefined
            );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blockList]);

    const [commentJSX, setCommentJSX] = useState<React.ReactNode>(<></>);

    useLayoutEffect(() => {
        if (comment.comment.type === "html") {
            setCommentJSX(
                parse(
                    settings.filterSwearWords
                        ? filterSwearWords(comment.comment.html)
                        : comment.comment.html,
                    { replace }
                )
            );
        } else if (comment.comment.type === "poll" && comment.comment.pollId) {
            setCommentJSX(<PollComponent id={comment.comment.pollId} />);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        settings.filterSwearWords,
        settings.linkPreview,
        settings.pdfViewer,
        settings.videoPlayer,
    ]);

    const content = useMemo(
        () => [
            comment.quote && !noQuote && (
                <blockquote
                    key={0}
                    style={{ border: "none" }}
                    className={`flex w-full${depth !== 0 ? " !my-0" : ""}`}
                >
                    <Box
                        className={`${
                            showQuote ? "cursor-pointer " : ""
                        }border-solid border-0 border-l-2 border-l-[#e7e7e7] dark:border-l-[#646262] !p-0 text-metahkg-grey !ml-0`}
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
                        <Box className="w-full">
                            <CommentBody comment={comment.quote} depth={depth + 1} />
                        </Box>
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
                            className="!text-metahkg-grey !normal-case !py-[3px] !px-[5px]"
                            onClick={() => {
                                setShowQuote(true);
                            }}
                        >
                            {t("commentBody.show_more")}
                        </Button>
                    )}
                </blockquote>
            ),
            <React.Fragment key={1}>
                {blocked && depth !== 0 ? (
                    <BlockedBtn
                        className="!my-2"
                        userName={comment.user.name}
                        setBlocked={setBlocked}
                        reason={blockList.find((x) => x.id === comment.user.id)?.reason}
                    />
                ) : (
                    commentJSX
                )}
            </React.Fragment>,
        ],
        [
            blockList,
            blocked,
            comment.quote,
            comment.user.id,
            comment.user.name,
            t,
            commentJSX,
            depth,
            noQuote,
            showQuote,
        ]
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
                        className={`child:object-contain child-a:no-underline child-a:hover:underline
                        child-img:h-full child-img:max-h-[800px] child-img:max-w-full
                        child-video:h-full child-video:max-h-[800px] child-video:max-w-full
                        child-blockquote:text-metahkg-grey child-blockquote:border-0
                        child-blockquote:border-l-2 child-blockquote:border-solid
                        child-blockquote:border-[#e7e7e7] dark:child-blockquote:border-[#646262]
                        child-blockquote:ml-0 child-blockquote:p-0
                        first:[&>div]:child-blockquote:ml-4
                        [&:not(span,button)]:child:[&>blockquote]:text-metahkg-grey
                        first:[&>*]:[&>div]:child-blockquote:mt-1
                        last:[&>*]:[&>div]:child-blockquote:mb-1
                        first:[&>*]:mt-3
                        last:[&>*]:mb-3
                        !my-0 max-w-full overflow-hidden w-full !break-words text-base`}
                    >
                        {content}
                    </Box>
                </Box>
            ) : (
                content
            )}
        </React.Fragment>
    );
});
export default CommentBody;
