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
import Comment from "./conversation/comment";
import Title from "./conversation/title";
import { roundup, splitarray } from "../lib/common";
import { useNavigate } from "react-router-dom";
import PageTop from "./conversation/pagetop";
import VisibilityDetector from "react-visibility-detector";
import { useHistory, useWidth } from "./ContextProvider";
import Share from "./conversation/share";
import PageBottom from "./conversation/pagebottom";
import Prism from "prismjs";
import PageSelect from "./conversation/pageselect";
import Dock from "./dock";
import useBtns from "./conversation/functions/btns";
import Gallery from "./conversation/gallery";
import { PhotoProvider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { commentType } from "../types/conversation/comment";
import {
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
    useVotes,
} from "./conversation/ConversationContext";
import { useUpdate } from "./conversation/functions/update";
import useFirstFetch from "./conversation/functions/firstfetch";
import useChangePage from "./conversation/functions/changePage";
import useOnScroll from "./conversation/functions/onScroll";
import useOnVisibilityChange from "./conversation/functions/onVisibilityChange";

/**
 * Gets data from /api/thread/<thread id(props.id)>/<conversation/users>
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
    const [votes] = useVotes();
    const [updating] = useUpdating();
    const [pages] = usePages();
    const [, setEnd] = useEnd();
    const [loading, setLoading] = useLoading();
    const [reRender] = useRerender();
    const [width] = useWidth();
    const [story] = useStory();
    const [galleryOpen, setGalleryOpen] = useGalleryOpen();
    const [images] = useImages();
    const [history, setHistory] = useHistory();
    const navigate = useNavigate();
    /* Checking if the error is a 404 error and if it is, it will navigate to the 404 page. */
    !query.page &&
        !query.c &&
        navigate(`${window.location.pathname}?page=1`, { replace: true });
    useFirstFetch();
    useEffect(() => {
        Prism.highlightAll();
        if (history.findIndex((i) => i.id === props.id) === -1) {
            history.push({ id: props.id, cid: 1, c: 1 });
            setHistory(history);
            localStorage.setItem("history", JSON.stringify(history));
        }
    });
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

    /* It's checking if the conversation, users, details and votes are all ready. */
    const ready = !!(
        thread &&
        thread.conversation.length &&
        (localStorage.user ? Object.keys(votes).length : 1)
    );
    if (ready && loading) {
        setTimeout(() => {
            loading && setLoading(false);
        }, 200);
    }
    if (ready && query.c) {
        navigate(`${window.location.pathname}?page=${finalPage}`, {
            replace: true,
        });
        setCurrentPage(finalPage);
        setTimeout(() => {
            document.getElementById(`c${query.c}`)?.scrollIntoView();
        }, 1);
    }
    const numofpages = roundup((thread?.c || 0) / 25);
    const btns = useBtns();
    const onVisibilityChange = useOnVisibilityChange();
    return (
        <div className="min-height-fullvh conversation-root">
            <Gallery open={galleryOpen} setOpen={setGalleryOpen} images={images} />
            <Dock btns={btns} />
            <Share />
            {!(width < 760) && (
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
            <Paper
                id="croot"
                key={reRender}
                className={`overflow-auto nobgimage noshadow conversation-paper${
                    loading ? "-loading" : ""
                }`}
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
                                                            name={comment.user.name}
                                                            id={comment.id}
                                                            op={
                                                                comment.user.id ===
                                                                thread.op.id
                                                            }
                                                            sex={comment.user.sex}
                                                            date={comment?.createdAt}
                                                            up={comment.U || 0}
                                                            down={comment.D || 0}
                                                            vote={votes?.[comment.id]}
                                                            userid={comment?.user.id}
                                                            slink={comment?.slink}
                                                        >
                                                            {comment?.comment}
                                                        </Comment>
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
        </div>
    );
}

export default memo(Conversation);
