import "./css/conversation.css";
import React, {
    createContext,
    memo,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
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
import axios, { AxiosError } from "axios";

import { roundup, splitarray } from "../lib/common";
import { useNavigate } from "react-router";
import PageTop from "./conversation/pagetop";
import VisibilityDetector from "react-visibility-detector";
import { useCat, useId, useProfile, useRecall, useSearch } from "./MenuProvider";
import { useHistory, useNotification, useWidth } from "./ContextProvider";
import Share from "./conversation/share";
import { useShareLink, useShareOpen, useShareTitle } from "./ShareProvider";
import PageBottom from "./conversation/pagebottom";
import Prism from "prismjs";
import PageSelect from "./conversation/pageselect";
import Dock from "./dock";
import { Collections, Refresh, Reply, Share as ShareIcon } from "@mui/icons-material";
import Gallery from "./conversation/gallery";
import { PhotoProvider } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { threadType } from "../types/conversation/thread";
import { commentType } from "../types/conversation/comment";

const ConversationContext = createContext<{
    story: [number, React.Dispatch<React.SetStateAction<number>>];
    tid: number;
    title?: string;
    // @ts-ignore
}>(null);

/**
 * Gets data from /api/thread/<thread id(props.id)>/<conversation/users>
 * Then renders it as Comments
 * @param {number} props.id the thread id
 * @returns full conversation as Comments
 */
function Conversation(props: { id: number }) {
    const query = queryString.parse(window.location.search);
    const [notification, setNotification] = useNotification();
    const [thread, setThread] = useState<null | threadType>(null);
    const [finalPage, setFinalPage] = useState(
        Number(query.page) || Math.floor(Number(query.c) / 25) + 1 || 1
    );
    /** Current page */
    const [currentPage, setCurrentPage] = useState(
        Number(query.page) || Math.floor(Number(query.c) / 25) + 1 || 1
    );
    const [votes, setVotes] = useState<any>({});
    const [updating, setUpdating] = useState(false);
    const [pages, setPages] = useState(1);
    const [end, setEnd] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reRender, setReRender] = useState(Math.random());
    const [story, setStory] = useState(0);
    const lastHeight = useRef(0);
    const [cat, setCat] = useCat();
    const [id, setId] = useId();
    const [recall] = useRecall();
    const [search] = useSearch();
    const [profile] = useProfile();
    const [shareOpen, setShareOpen] = useShareOpen();
    const [shareTitle, setShareTitle] = useShareTitle();
    const [shareLink, setShareLink] = useShareLink();
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [images, setImages] = useState<{ src: string }[]>([]);
    const [history, setHistory] = useHistory();
    const navigate = useNavigate();
    /* Checking if the error is a 404 error and if it is, it will navigate to the 404 page. */
    const onError = function (err: AxiosError) {
        !notification.open &&
            setNotification({
                open: true,
                text: err?.response?.data?.error || err?.response?.data || "",
            });
        err?.response?.status === 404 && navigate("/404", { replace: true });
        err?.response?.status === 401 && navigate("/401", { replace: true });
    };
    !query.page &&
        !query.c &&
        navigate(`${window.location.pathname}?page=1`, { replace: true });
    useEffect(() => {
        axios
            .get(`/api/thread/${props.id}?page=${finalPage}`, {
                headers: { authorization: localStorage.getItem("token") || "" },
            })
            .then((res: { data: threadType }) => {
                res.data.slink && setThread(res.data);
                const historyIndex = history.findIndex((i) => i.id === props.id);
                if (historyIndex && history[historyIndex].c < res.data.c) {
                    history[historyIndex].c = res.data.c;
                    setHistory(history);
                    localStorage.setItem("history", JSON.stringify(history));
                }
                !cat && !(recall || search || profile) && setCat(res.data.category.id);
                id !== res.data.id && setId(res.data.id);
                document.title = `${res.data.title} | Metahkg`;
                if (!res.data.slink) {
                    axios
                        .post(
                            "https://api-us.wcyat.me/create",
                            {
                                url: `${window.location.origin}/thread/${props.id}?page=1`,
                            },
                            {
                                headers: {
                                    authorization: localStorage.getItem("token") || "",
                                },
                            }
                        )
                        .then((sres) => {
                            res.data.slink = sres.data;
                            setThread(res.data);
                        })
                        .catch(() => {
                            setNotification({
                                open: true,
                                text: "Unable to generate shortened link. A long link will be used instead.",
                            });
                            res.data.slink = `${window.location.origin}/thread/${props.id}?page=1`;
                            setThread(res.data);
                        });
                }
                res.data.conversation.length % 25 && setEnd(true);
            })
            .catch(onError);
        axios
            .get(`/api/images/${props.id}`, {
                headers: { authorization: localStorage.getItem("token") || "" },
            })
            .then((res) => {
                res.data.forEach((item: { image: string }) => {
                    images.push({
                        src: item.image,
                    });
                });
                res.data.length && setImages(images);
            })
            .catch(onError);
        if (localStorage.user) {
            axios
                .get(`/api/getvotes?id=${props.id}`, {
                    headers: { authorization: localStorage.getItem("token") || "" },
                })
                .then((res) => {
                    setVotes(res.data);
                })
                .catch(onError);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reRender]);
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
    function update() {
        if (thread) {
            setUpdating(true);
            const openNewPage = !(thread.conversation.length % 25);
            axios
                .get(
                    `/api/thread/${props.id}?page=${
                        openNewPage ? finalPage + 1 : finalPage
                    }${
                        openNewPage
                            ? ""
                            : `&start=${
                                  thread.conversation[thread.conversation.length - 1].id +
                                  1
                              }`
                    }`,
                    {
                        headers: { authorization: localStorage.getItem("token") || "" },
                    }
                )
                .then((res: { data: threadType }) => {
                    if (!res.data.conversation.length) {
                        setEnd(true);
                        setUpdating(false);
                        return;
                    }
                    if (!openNewPage) {
                        res.data.conversation.forEach((item) => {
                            thread.conversation.push(item);
                        });
                        lastHeight.current = 0;
                        setThread({ ...thread, conversation: thread.conversation });
                        setTimeout(() => {
                            document
                                .getElementById(`c${res.data?.conversation[0]?.id}`)
                                ?.scrollIntoView();
                        }, 1);
                        thread.conversation.length % 25 && setEnd(true);
                    } else {
                        for (let i = 0; i < res.data.conversation.length; i++)
                            thread.conversation.push(res.data.conversation?.[i]);
                        setThread({ ...thread, conversation: thread.conversation });
                        setUpdating(false);
                        setFinalPage(finalPage + 1);
                        setPages(Math.floor((thread.conversation.length - 1) / 25) + 1);
                        navigate(`/thread/${props.id}?page=${finalPage + 1}`, {
                            replace: true,
                        });
                        setCurrentPage(finalPage + 1);
                    }
                    setUpdating(false);
                });
        }
    }

    function changePage(newPage: number) {
        setLoading(true);
        // @ts-ignore
        setThread({ ...thread, conversation: [] });
        setPages(1);
        setFinalPage(newPage);
        lastHeight.current = 0;
        setEnd(false);
        setReRender(Math.random());
        navigate(`${window.location.pathname}?page=${newPage}`, { replace: true });
        setCurrentPage(newPage);
        axios
            .get(`/api/thread/${props.id}?type=2&page=${newPage}`, {
                headers: { authorization: localStorage.getItem("token") || "" },
            })
            .then((res: { data: threadType }) => {
                if (!res.data.conversation.length) {
                    setNotification({ open: true, text: "Page not found!" });
                    return;
                }
                setThread(res.data);
                res.data.conversation.length % 25 && setEnd(true);
                document.getElementById(String(finalPage))?.scrollIntoView();
            });
    }

    /**
     * When the user scrolls to the bottom of the page, the function calls the update function
     * @param {any} e - The event object.
     */
    function onScroll(e: any) {
        if (!end && !updating) {
            const diff = e.target.scrollHeight - e.target.scrollTop;
            if (
                (e.target.clientHeight >= diff - 1.5 &&
                    e.target.clientHeight <= diff + 1.5) ||
                diff < e.target.clientHeight
            ) {
                update();
            }
        }
        const index = history.findIndex((i) => i.id === props.id);
        if (index !== -1 && thread) {
            const arr = [...Array(thread.conversation.length)].map((und, c) => {
                return Math.abs(
                    Number(
                        document.getElementById(`c${c + 1}`)?.getBoundingClientRect()?.top
                    )
                );
            });
            const currentcomment =
                arr.findIndex(
                    (i) =>
                        i ===
                        Math.min.apply(
                            Math,
                            arr.filter((i) => Boolean(i))
                        )
                ) + 1;
            if (history[index]?.cid !== currentcomment) {
                history[index].cid = currentcomment;
                setHistory(history);
                localStorage.setItem("history", JSON.stringify(history));
            }
        }
    }

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
    const [width] = useWidth();
    const numofpages = roundup((thread?.c || 0) / 25);
    const btns = [
        {
            icon: <Refresh />,
            action: () => {
                update();
                const croot = document.getElementById("croot");
                const newscrollTop =
                    croot?.scrollHeight || 0 - (croot?.clientHeight || 0);
                // @ts-ignore
                croot.scrollTop = newscrollTop;
            },
            title: "Refresh",
        },
        {
            icon: <Collections />,
            action: () => {
                if (images.length) setGalleryOpen(true);
                else setNotification({ open: true, text: "No images!" });
            },
            title: "Images",
        },
        {
            icon: <Reply />,
            action: () => {
                navigate(`/comment/${props.id}`);
            },
            title: "Reply",
        },
        {
            icon: <ShareIcon className="font-size-19-force" />,
            action: () => {
                if (thread && thread.title && thread.slink) {
                    !shareOpen && setShareOpen(true);
                    shareTitle !== thread.title &&
                        thread.title &&
                        setShareTitle(thread.title);
                    shareLink !== thread.slink &&
                        thread.slink &&
                        setShareLink(thread.slink);
                }
            },
            title: "Share",
        },
    ];
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
            <Title category={thread?.category?.id} title={thread?.title} btns={btns} />
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
                                                const croot =
                                                    document.getElementById("croot");
                                                let Page = page;
                                                if (isVisible) {
                                                    lastHeight.current =
                                                        croot?.scrollTop ||
                                                        lastHeight.current;
                                                    if (
                                                        Page !== Number(query.page) &&
                                                        Page
                                                    ) {
                                                        navigate(
                                                            `${window.location.pathname}?page=${Page}`,
                                                            {
                                                                replace: true,
                                                            }
                                                        );
                                                        setCurrentPage(Page);
                                                    }
                                                }
                                                if (
                                                    !isVisible &&
                                                    thread.conversation.length
                                                ) {
                                                    if (
                                                        lastHeight.current !==
                                                        croot?.scrollTop
                                                    ) {
                                                        Page =
                                                            // @ts-ignore
                                                            croot.scrollTop >
                                                            lastHeight.current
                                                                ? Page
                                                                : Page - 1;
                                                        if (
                                                            lastHeight.current &&
                                                            Page !== Number(query.page) &&
                                                            Page
                                                        ) {
                                                            navigate(
                                                                `${window.location.pathname}?page=${Page}`,
                                                                {
                                                                    replace: true,
                                                                }
                                                            );
                                                            setCurrentPage(Page);
                                                        }
                                                    }
                                                }
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
                                        <ConversationContext.Provider
                                            value={{
                                                story: [story, setStory],
                                                tid: id,
                                                title: thread?.title,
                                            }}
                                        >
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
                                        </ConversationContext.Provider>
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

export function useTid() {
    const { tid } = useContext(ConversationContext);
    return tid;
}

export function useTitle() {
    const { title } = useContext(ConversationContext);
    return title || "";
}

export function useStory() {
    const { story } = useContext(ConversationContext);
    return story;
}

export default memo(Conversation);
