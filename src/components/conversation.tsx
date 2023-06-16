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

import "react-photo-view/dist/react-photo-view.css";
import React, { memo, useEffect, useMemo } from "react";
import { Box, LinearProgress, Paper, SelectChangeEvent } from "@mui/material";
import queryString from "query-string";
import Title from "./conversation/title";
import { roundup } from "../lib/common";
import { useNavigate } from "react-router-dom";
import PageTop from "./conversation/pageTop";
import VisibilitySensor from "react-visibility-sensor";
import { useHistory, useIsSmallScreen, useUser } from "./AppContextProvider";
import PageBottom from "./conversation/pageBottom";
import PageSelect from "./conversation/pageSelect";
import useBtns from "../hooks/conversation/btns";
import { PhotoProvider } from "react-photo-view";
import {
    useCBottom,
    useCRoot,
    useCurrentPage,
    useEnd,
    useFinalPage,
    useGalleryOpen,
    useLimit,
    useLoading,
    usePages,
    useRerender,
    useSort,
    useStory,
    useThread,
    useUpdating,
    useVotes,
} from "./conversation/ConversationContext";
import { useUpdate } from "../hooks/conversation/update";
import useFirstFetch from "../hooks/conversation/firstfetch";
import useChangePage from "../hooks/conversation/changePage";
import useOnScroll from "../hooks/conversation/onScroll";
import useOnVisibilityChange from "../hooks/conversation/onVisibilityChange";
import FloatingEditor from "./floatingEditor";
import Gallery from "./conversation/gallery";
import Dock from "./dock";
import Share from "./conversation/share";
import PinnedComment from "./conversation/pin";
import Comment from "./conversation/comment";
import { LoadingButton } from "@mui/lab";
import { Refresh } from "@mui/icons-material";
import { useFirstRender } from "../hooks/useFirstRender";

function Conversation(props: { id: number }) {
    const query = queryString.parse(window.location.search);
    const [thread, setThread] = useThread();
    const [finalPage, setFinalPage] = useFinalPage();
    /** Current page */
    const [currentPage, setCurrentPage] = useCurrentPage();
    const [votes] = useVotes();
    const [updating] = useUpdating();
    const [pages] = usePages();
    const [, setEnd] = useEnd();
    const [loading, setLoading] = useLoading();
    const [reRender, setReRender] = useRerender();
    const isSmallScreen = useIsSmallScreen();
    const [story] = useStory();
    const [sort] = useSort();
    const [limit] = useLimit();
    const [galleryOpen, setGalleryOpen] = useGalleryOpen();
    const [history, setHistory] = useHistory();
    const [user] = useUser();
    const cRoot = useCRoot();
    const cBottom = useCBottom();
    const navigate = useNavigate();
    const firstRender = useFirstRender();
    /* Checking if the error is a 404 error and if it is, it will navigate to the 404 page. */

    const firstFetch = useFirstFetch();

    useEffect(() => {
        firstFetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reRender]);

    useEffect(() => {
        if (history.findIndex((i) => i.id === props.id) === -1) {
            history.push({ id: props.id, cid: 1, c: 1 });
            setHistory(history);
            localStorage.setItem("history", JSON.stringify(history));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    /**
     * It fetches new comments, or the next page (if last comment id % limit = 0)
     * of messages from the server and appends them to the conversation array
     */
    const update = useUpdate();

    const changePage = useChangePage();

    const onScroll = useOnScroll();

    const ready = !!(thread && thread.conversation.length && (user ? votes : 1));

    useEffect(() => {
        !query.page &&
            !query.c &&
            navigate(`${window.location.pathname}?page=1`, { replace: true });

        if (ready) {
            if (loading)
                setTimeout(() => {
                    loading && setLoading(false);
                }, 100);

            if (query.c) {
                navigate(`${window.location.pathname}?page=${finalPage}`, {
                    replace: true,
                });
                setCurrentPage(finalPage);
            }
        }
    }, [
        ready,
        loading,
        navigate,
        query.c,
        finalPage,
        setCurrentPage,
        query.page,
        setLoading,
    ]);

    useEffect(() => {
        if (!firstRender) {
            setCurrentPage(1);
            setFinalPage(1);
            setLoading(true);
            setThread(null);
            setReRender(!reRender);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sort, limit]);

    const numOfPages = roundup((thread?.count || 0) / limit);
    const btns = useBtns();
    const onVisibilityChange = useOnVisibilityChange();

    return useMemo(
        () => (
            <Box
                className="min-h-screen flex flex-col relative"
                sx={(theme) => ({
                    "& *::selection": {
                        background: theme.palette.secondary.main,
                        color: "black",
                    },
                })}
            >
                <PhotoProvider>
                    <FloatingEditor />
                    <Gallery
                        open={galleryOpen}
                        setOpen={setGalleryOpen}
                        images={thread?.images || []}
                    />
                    <Dock btns={btns} />
                    <Share />
                    {!isSmallScreen && (
                        <PageSelect
                            last={currentPage !== 1 && numOfPages > 1}
                            next={currentPage !== numOfPages && numOfPages > 1}
                            pages={numOfPages}
                            page={currentPage}
                            onLastClicked={() => {
                                changePage(currentPage - 1);
                            }}
                            onNextClicked={() => {
                                changePage(currentPage + 1);
                            }}
                            onSelect={(e) => {
                                changePage(Number(e.target.value));
                            }}
                        />
                    )}
                    {loading && (
                        <LinearProgress
                            className="w-full !absolute !top-0 !right-0"
                            color="secondary"
                        />
                    )}
                    <Title
                        category={thread?.category}
                        title={thread?.title}
                        btns={btns}
                    />
                    {thread?.pin && <PinnedComment comment={thread?.pin} />}
                    <Paper
                        ref={cRoot}
                        key={Number(reRender)}
                        className={`overflow-auto !bg-none !shadow-none ${
                            (thread?.pin && "max-h-[calc(100vh-96px)]") ||
                            "max-h-[calc(100vh-46px)]"
                        }`}
                        sx={{ bgcolor: "primary.dark" }}
                        onScroll={onScroll}
                    >
                        <Box className="w-full max-height-full max-w-full">
                            {ready &&
                                [...Array(pages)].map((p, index) => {
                                    const page =
                                        sort === "time"
                                            ? roundup(thread.conversation[0].id / limit) +
                                              index
                                            : index + 1;

                                    return (
                                        <Box key={index}>
                                            <VisibilitySensor
                                                intervalDelay={200}
                                                partialVisibility
                                                scrollCheck
                                                onChange={(isVisible: boolean) => {
                                                    onVisibilityChange(isVisible, page);
                                                }}
                                            >
                                                <PageTop
                                                    id={page}
                                                    pages={numOfPages}
                                                    page={page}
                                                    onChange={(
                                                        e: SelectChangeEvent<number>
                                                    ) => {
                                                        changePage(
                                                            Number(e.target.value)
                                                        );
                                                    }}
                                                    last={!(page === 1 && !index)}
                                                    next={page !== numOfPages}
                                                    onLastClicked={() => {
                                                        changePage(page - 1);
                                                    }}
                                                    onNextClicked={() => {
                                                        changePage(page + 1);
                                                    }}
                                                />
                                            </VisibilitySensor>
                                            <React.Fragment>
                                                {(sort === "time"
                                                    ? thread.conversation.filter(
                                                          (comment) =>
                                                              comment.id >
                                                                  (page - 1) * limit &&
                                                              comment.id <= page * limit
                                                      )
                                                    : thread.conversation.slice(
                                                          index * limit,
                                                          (index + 1) * limit
                                                      )
                                                ).map(
                                                    (comment) =>
                                                        !("removed" in comment) &&
                                                        (story
                                                            ? story === comment?.user.id
                                                            : 1) && (
                                                            <Comment
                                                                key={comment.id}
                                                                inThread
                                                                comment={comment}
                                                                scrollIntoView={
                                                                    Number(query.c) ===
                                                                    comment.id
                                                                }
                                                            />
                                                        )
                                                )}
                                            </React.Fragment>
                                        </Box>
                                    );
                                })}
                        </Box>
                        <Box
                            ref={cBottom}
                            className="flex justify-center items-center h-[90px]"
                            sx={{
                                bgcolor: "primary.dark",
                            }}
                        >
                            <LoadingButton
                                variant="outlined"
                                color="secondary"
                                loading={updating}
                                onClick={() => {
                                    setEnd(false);
                                    update();
                                }}
                                startIcon={<Refresh />}
                                loadingPosition="start"
                            >
                                Update
                            </LoadingButton>
                        </Box>
                        <PageBottom />
                    </Paper>
                </PhotoProvider>
            </Box>
        ),
        [
            btns,
            cBottom,
            cRoot,
            changePage,
            currentPage,
            galleryOpen,
            isSmallScreen,
            limit,
            loading,
            numOfPages,
            onScroll,
            onVisibilityChange,
            pages,
            query.c,
            reRender,
            ready,
            setEnd,
            setGalleryOpen,
            sort,
            story,
            thread?.category,
            thread?.conversation,
            thread?.images,
            thread?.pin,
            thread?.title,
            update,
            updating,
        ]
    );
}

export default memo(Conversation);
