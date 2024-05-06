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

import { Comment } from "@metahkg/api";
import parse from "html-react-parser";
import React, { useMemo } from "react";

import { memo } from "react";
const RenderComment = memo(function RenderComment(props: {
    comment: Comment;
    depth: number;
    darkMode: boolean;
}) {
    const { comment, depth, darkMode } = props;
    const commentJSX = useMemo(
        () =>
            comment.comment.type === "html" ? parse(comment.comment.html) : comment.text,
        [comment.comment, comment.text]
    );
    const content = useMemo(
        () => [
            comment.quote && depth < 3 && (
                <blockquote
                    style={{
                        color: "#aca9a9",
                        borderLeft: `2px solid ${darkMode ? "#646262" : "e7e7e7"}`,
                        marginLeft: 0,
                    }}
                >
                    <div style={{ marginLeft: 15 }}>
                        <RenderComment
                            comment={comment.quote}
                            depth={depth + 1}
                            darkMode={darkMode}
                        />
                    </div>
                </blockquote>
            ),
            commentJSX,
        ],
        [comment.quote, commentJSX, darkMode, depth]
    );
    return <React.Fragment>{content}</React.Fragment>;
});
export default RenderComment;
