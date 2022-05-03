import "./css/conversation.css";
import React, { memo, useEffect } from "react";
import {
    Box,
    Button,
    CircularProgress,
    LinearProgress,
    Paper,
    SelectChangeEvent,
} from "@mui/material";
import queryString from "query-string";
import loadable from "@loadable/component";
import Title from "./conversation/title";
import { roundup, splitarray } from "../lib/common";
import { useNavigate } from "react-router-dom";
import PageTop from "./conversation/pagetop";
import VisibilityDetector from "react-visibility-detector";
import { useHistory, useIsSmallScreen, useUser } from "./ContextProvider";
import PageBottom from "./conversation/pagebottom";
import PageSelect from "./conversation/pageselect";
import useBtns from "./conversation/functions/btns";
import { PhotoProvider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { commentType } from "../types/conversation/comment";
import {
    useCRoot,
    useCurrentPage,
    useEnd,
    useFinalPage,
    useGalleryOpen,
    useImages,
    useLoading,
    usePages,
    useRerender,
    useStory,
    useThread,
    useUpdating,
    useUserVotes,
} from "./conversation/ConversationContext";
import { useUpdate } from "./conversation/functions/update";
import useFirstFetch from "./conversation/functions/firstfetch";
import useChangePage from "./conversation/functions/changePage";
import useOnScroll from "./conversation/functions/onScroll";
import useOnVisibilityChange from "./conversation/functions/onVisibilityChange";
import Comment from "./conversation/comment";
import FloatingEditor from "./floatingEditor";

const PinnedComment = loadable(() => import("./conversation/pin"));
const Share = loadable(() => import("./conversation/share"));
const Gallery = loadable(() => import("./conversation/gallery"));
const Dock = loadable(() => import("./dock"));

/**
 * Gets data from /api/posts/thread/<thread id(props.id)>/<conversation/users>
 * Then renders it as Comments
 * @param {number} props.id the thread id
 * @returns full conversation as Comments
 */
function Conversation(props: { id: number }) {
    const query = queryString.parse(window.location.search);
    const [thread] = useThread();
    const [finalPage] = useFinalPage();
    /** Current page */
    const [currentPage, setCurrentPage] = useCurrentPage();
    const [userVotes] = useUserVotes();
    const [updating] = useUpdating();
    const [pages] = usePages();
    const [, setEnd] = useEnd();
    const [loading, setLoading] = useLoading();
    const [reRender] = useRerender();
    const isSmallScreen = useIsSmallScreen();
    const [story] = useStory();
    const [galleryOpen, setGalleryOpen] = useGalleryOpen();
    const [images] = useImages();
    const [history, setHistory] = useHistory();
    const [user] = useUser();
    const croot = useCRoot();
    const navigate = useNavigate();
    /* Checking if the error is a 404 error and if it is, it will navigate to the 404 page. */
    !query.page &&
        !query.c &&
        navigate(`${window.location.pathname}?page=1`, { replace: true });
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

    /**
     * When the user scrolls to the bottom of the page, the function calls the update function
     * @param {any} e - The event object.
     */
    const onScroll = useOnScroll();

    const ready = !!(thread && thread.conversation.length && (user ? userVotes : 1));

    if (ready && loading)
        setTimeout(() => {
            loading && setLoading(false);
        }, 100);

    if (ready && query.c) {
        navigate(`${window.location.pathname}?page=${finalPage}`, {
            replace: true,
        });
        setCurrentPage(finalPage);
    }

    const numofpages = roundup((thread?.c || 0) / 25);
    const btns = useBtns();
    const onVisibilityChange = useOnVisibilityChange();
    return (
        <Box
            className="min-height-fullvh conversation-root"
            sx={(theme) => ({
                "& *::selection": {
                    background: theme.palette.secondary.main,
                    color: "black",
                },
            })}
        >
            <FloatingEditor />
            <Gallery open={galleryOpen} setOpen={setGalleryOpen} images={images} />
            <Dock btns={btns} />
            <Share />
            {!isSmallScreen && (
                <PageSelect
                    last={currentPage !== 1 && numofpages > 1}
                    next={currentPage !== numofpages && numofpages > 1}
                    pages={numofpages}
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
            {loading && <LinearProgress className="fullwidth" color="secondary" />}
            <Title category={thread?.category} title={thread?.title} btns={btns} />
            {thread?.pin && <PinnedComment comment={thread?.pin} />}
            <Paper
                ref={croot}
                key={reRender}
                className={`overflow-auto nobgimage noshadow conversation-paper${
                    thread?.pin ? "-pin" : ""
                }${loading ? "-loading" : ""}`}
                sx={{ bgcolor: "primary.dark" }}
                onScroll={onScroll}
            >
                <Box className="fullwidth max-height-full max-width-full">
                    <PhotoProvider>
                        {ready &&
                            [...Array(pages)].map((p, index) => {
                                const page =
                                    roundup(thread.conversation[0].id / 25) + index;
                                const totalpages = roundup((thread.c || 0) / 25);
                                return (
                                    <Box key={index}>
                                        <VisibilityDetector
                                            onVisibilityChange={(isVisible) => {
                                                onVisibilityChange(isVisible, page);
                                            }}
                                        >
                                            <PageTop
                                                id={page}
                                                pages={totalpages}
                                                page={page}
                                                onChange={(
                                                    e: SelectChangeEvent<number>
                                                ) => {
                                                    changePage(Number(e.target.value));
                                                }}
                                                last={!(page === 1 && !index)}
                                                next={page !== totalpages}
                                                onLastClicked={() => {
                                                    changePage(page - 1);
                                                }}
                                                onNextClicked={() => {
                                                    changePage(page + 1);
                                                }}
                                            />
                                        </VisibilityDetector>
                                        <React.Fragment>
                                            {splitarray(
                                                thread.conversation,
                                                index * 25,
                                                (index + 1) * 25 - 1
                                            ).map(
                                                (comment: commentType) =>
                                                    !comment?.removed &&
                                                    (story
                                                        ? story === comment?.user.id
                                                        : 1) && (
                                                        <Comment
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
                    </PhotoProvider>
                </Box>
                <Box
                    className="flex justify-center align-center conversation-bottom"
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
        </Box>
    );
}

export default memo(Conversation);
