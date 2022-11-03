import "react-photo-view/dist/react-photo-view.css";
import React, { memo, useEffect, useMemo } from "react";
import {
    Box,
    Button,
    CircularProgress,
    LinearProgress,
    Paper,
    SelectChangeEvent,
} from "@mui/material";
import queryString from "query-string";
import Title from "./conversation/title";
import { roundup } from "../lib/common";
import { useNavigate } from "react-router-dom";
import PageTop from "./conversation/pageTop";
import VisibilitySensor from "react-visibility-sensor";
import { useHistory, useIsSmallScreen, useUser } from "./AppContextProvider";
import PageBottom from "./conversation/pageBottom";
import PageSelect from "./conversation/pageSelect";
import useBtns from "./conversation/functions/btns";
import { PhotoProvider } from "react-photo-view";
import {
    useCBottom,
    useCRoot,
    useCurrentPage,
    useEnd,
    useFinalPage,
    useGalleryOpen,
    useLoading,
    usePages,
    useRerender,
    useStory,
    useThread,
    useUpdating,
    useVotes,
} from "./conversation/ConversationContext";
import { useUpdate } from "./conversation/functions/update";
import useFirstFetch from "./conversation/functions/firstfetch";
import useChangePage from "./conversation/functions/changePage";
import useOnScroll from "./conversation/functions/onScroll";
import useOnVisibilityChange from "./conversation/functions/onVisibilityChange";
import FloatingEditor from "./floatingEditor";
import Gallery from "./conversation/gallery";
import Dock from "./dock";
import Share from "./conversation/share";
import PinnedComment from "./conversation/pin";
import Comment from "./conversation/comment";

function Conversation(props: { id: number }) {
    const query = queryString.parse(window.location.search);
    const [thread] = useThread();
    const [finalPage] = useFinalPage();
    /** Current page */
    const [currentPage, setCurrentPage] = useCurrentPage();
    const [votes] = useVotes();
    const [updating] = useUpdating();
    const [pages] = usePages();
    const [, setEnd] = useEnd();
    const [loading, setLoading] = useLoading();
    const [reRender] = useRerender();
    const isSmallScreen = useIsSmallScreen();
    const [story] = useStory();
    const [galleryOpen, setGalleryOpen] = useGalleryOpen();
    const [history, setHistory] = useHistory();
    const [user] = useUser();
    const cRoot = useCRoot();
    const cBottom = useCBottom();
    const navigate = useNavigate();
    /* Checking if the error is a 404 error and if it is, it will navigate to the 404 page. */

    useFirstFetch();

    useEffect(() => {
        if (history.findIndex((i) => i.id === props.id) === -1) {
            history.push({ id: props.id, cid: 1, c: 1 });
            setHistory(history);
            localStorage.setItem("history", JSON.stringify(history));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    /**
     * It fetches new comments, or the next page (if last comment id % 25 = 0)
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

    const numOfPages = roundup((thread?.count || 0) / 25);
    const btns = useBtns();
    const onVisibilityChange = useOnVisibilityChange();

    return useMemo(
        () => (
            <Box
                className="min-h-screen conversation-root"
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
                        images={
                            thread?.images?.map((image) => ({ src: image.src })) || []
                        }
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
                    {loading && <LinearProgress className="w-full" color="secondary" />}
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
                            (thread?.pin &&
                                (loading
                                    ? "max-h-[calc(100vh-101px)]"
                                    : "max-h-[calc(100vh-97px)]")) ||
                            (loading
                                ? "max-h-[calc(100vh-51px)]"
                                : "max-h-[calc(100vh-47px)]")
                        }`}
                        sx={{ bgcolor: "primary.dark" }}
                        onScroll={onScroll}
                    >
                        <Box className="w-full max-height-full max-w-full">
                            {ready &&
                                [...Array(pages)].map((p, index) => {
                                    const page =
                                        roundup(thread.conversation[0].id / 25) + index;

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
                                                {thread.conversation
                                                    .slice(index * 25, (index + 1) * 25)
                                                    .map(
                                                        (comment) =>
                                                            !("removed" in comment) &&
                                                            (story
                                                                ? story ===
                                                                  comment?.user.id
                                                                : 1) && (
                                                                <Comment
                                                                    key={comment.id}
                                                                    inThread
                                                                    comment={comment}
                                                                    scrollIntoView={
                                                                        Number(
                                                                            query.c
                                                                        ) === comment.id
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
                            {!updating ? (
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => {
                                        setEnd(false);
                                        update();
                                    }}
                                >
                                    Update
                                </Button>
                            ) : (
                                <CircularProgress disableShrink color="secondary" />
                            )}
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
            story,
            thread,
            update,
            updating,
        ]
    );
}

export default memo(Conversation);
