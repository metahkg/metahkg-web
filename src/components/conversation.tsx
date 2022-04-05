import "./css/conversation.css";
import React, {
  createContext,
  memo,
  SetStateAction,
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
import {
  useCat,
  useId,
  useProfile,
  useRecall,
  useSearch,
} from "./MenuProvider";
import { useHistory, useNotification, useWidth } from "./ContextProvider";
import Share from "./conversation/share";
import { useShareLink, useShareOpen, useShareTitle } from "./ShareProvider";
import PageBottom from "./conversation/pagebottom";
import Prism from "prismjs";
import PageSelect from "./conversation/pageselect";
import Dock from "./dock";
import {
  Collections,
  Refresh,
  Reply,
  Share as ShareIcon,
} from "@mui/icons-material";
import Gallery from "./conversation/gallery";
import { PhotoProvider } from "react-photo-view";
import 'react-photo-view/dist/react-photo-view.css';
const ConversationContext = createContext<any>(null);
type comment = {
  /** comment id */
  id: number;
  /** comment user id */
  user: number;
  /** the comment (in stringified html) */
  comment: string;
  /** date string */
  createdAt: string;
  /** number of downvotes */
  D?: number;
  /** number of upvotes */
  U?: number;
};
type details = {
  /** thread shortened link */
  slink?: string;
  /** thread category id */
  category?: number;
  /** thread title */
  title?: string;
  /** number of comments */
  c?: number;
  /** thread original poster name */
  op?: string;
};
/**
 * Gets data from /api/thread/<thread id(props.id)>/<conversation/users>
 * Then renders it as Comments
 * @param {number} props.id the thread id
 * @returns full conversation as Comments
 */
function Conversation(props: { id: number }) {
  const query = queryString.parse(window.location.search);
  const [notification, setNotification] = useNotification();
  const [conversation, setConversation] = useState<comment[]>([]);
  const [lastpage, setLastPage] = useState(
    Number(query.page) || Math.floor(Number(query.c) / 25) + 1 || 1
  );
  /** Current page */
  const [cpage, setCPage] = useState(
    Number(query.page) || Math.floor(Number(query.c) / 25) + 1 || 1
  );
  const [users, setUsers] = useState<any>({});
  const [details, setDetails] = useState<details>({});
  const [votes, setVotes] = useState<any>({});
  const [updating, setUpdating] = useState(false);
  const [pages, setPages] = useState(1);
  const [end, setEnd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [n, setN] = useState(Math.random());
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
  const [images, setImages] = useState<
    { original: string; thumbnail: string }[]
  >([]);
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
      .get(`/api/thread/${props.id}?type=1`)
      .then((res) => {
        res.data.slink && setDetails(res.data);
        const historyIndex = history.findIndex((i) => i.id === props.id);
        if (historyIndex && history[historyIndex].c < res.data.c) {
          history[historyIndex].c = res.data.c;
          setHistory(history);
          localStorage.setItem("history", JSON.stringify(history));
        }
        !cat && !(recall || search || profile) && setCat(res.data.category);
        id !== res.data.id && setId(res.data.id);
        document.title = `${res.data.title} | Metahkg`;
        if (!res.data.slink) {
          axios
            .post("https://api-us.wcyat.me/create", {
              url: `${window.location.origin}/thread/${props.id}?page=1`,
            })
            .then((sres) => {
              setDetails(
                Object.assign(res.data, {
                  slink: `https://l.wcyat.me/${sres.data.id}`,
                })
              );
            })
            .catch(() => {
              setNotification({
                open: true,
                text: "Unable to generate shortened link. A long link will be used instead.",
              });
              setDetails(
                Object.assign(res.data, {
                  slink: `${window.location.origin}/thread/${props.id}?page=1`,
                })
              );
            });
        }
      })
      .catch(onError);
    axios
      .get(`/api/thread/${props.id}?type=0`)
      .then((res) => {
        setUsers(res.data);
      })
      .catch(onError);
    axios
      .get(`/api/thread/${props.id}?type=2&page=${lastpage}`)
      .then((res) => {
        /** redirect to 404 if thread (or page) not found */
        res.data?.[0] === null && navigate("/404", { replace: true });
        for (let i = 0; i < res.data.length; i++) {
          conversation.push(res.data?.[i]);
        }
        setConversation(res.data);
        res.data.length % 25 && setEnd(true);
      })
      .catch(onError);
    axios
      .get(`/api/images/${props.id}`)
      .then((res) => {
        res.data.forEach((item: { image: string }) => {
          images.push({
            original: item.image,
            thumbnail: `https://i.metahkg.org/thumbnail?src=${encodeURIComponent(
              item.image
            )}`,
          });
        });
        res.data.length && setImages(images);
      })
      .catch(onError);
    if (localStorage.user) {
      axios
        .get(`/api/getvotes?id=${props.id}`)
        .then((res) => {
          setVotes(res.data);
        })
        .catch(onError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);
  useEffect(() => {
    Prism.highlightAll();
  });
  useEffect(() => {
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
    setUpdating(true);
    const newpage = !(conversation.length % 25);
    axios
      .get(
        `/api/thread/${props.id}?type=2&page=${
          newpage ? lastpage + 1 : lastpage
        }${
          newpage
            ? ""
            : `&start=${conversation[conversation.length - 1].id + 1}`
        }`
      )
      .then((res) => {
        if (res.data?.[0] === null) {
          setEnd(true);
          setUpdating(false);
          return;
        }
        if (!newpage) {
          for (let i = 0; i < res.data.length; i++) {
            conversation.push(res.data?.[i]);
          }
          lastHeight.current = 0;
          setConversation(conversation);
          setTimeout(() => {
            document.getElementById(`c${res.data?.[0]?.id}`)?.scrollIntoView();
          }, 1);
          conversation.length % 25 && setEnd(true);
        } else {
          for (let i = 0; i < res.data.length; i++)
            conversation.push(res.data?.[i]);
          setConversation(conversation);
          setUpdating(false);
          setLastPage((lastpage) => lastpage + 1);
          setPages(Math.floor((conversation.length - 1) / 25) + 1);
          navigate(`/thread/${props.id}?page=${lastpage + 1}`, {
            replace: true,
          });
          setCPage(lastpage + 1);
        }
        setUpdating(false);
      });
  }
  /**
   * It takes a page number and sends a request to the server to get the next page of comments
   * @param {number} p - new page number
   */
  function changePage(p: number) {
    setLoading(true);
    setConversation([]);
    setPages(1);
    setLastPage(p);
    lastHeight.current = 0;
    setEnd(false);
    setN((n) => n + (n > 1 ? -1 : 1) * Math.random());
    navigate(`${window.location.pathname}?page=${p}`, { replace: true });
    setCPage(p);
    axios.get(`/api/thread/${props.id}?type=2&page=${p}`).then((res) => {
      if (res.data?.[0] === null) {
        setNotification({ open: true, text: "Page not found!" });
        return;
      }
      setConversation(res.data);
      res.data.length % 25 && setEnd(true);
      document.getElementById(String(lastpage))?.scrollIntoView();
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
    if (index !== -1) {
      const arr = [...Array(conversation.length)].map((und, c) => {
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
    conversation.length &&
    Object.keys(users).length &&
    Object.keys(details).length &&
    (localStorage.user ? Object.keys(votes).length : 1)
  );
  if (ready && loading) {
    setTimeout(() => {
      loading && setLoading(false);
    }, 200);
  }
  if (ready && query.c) {
    navigate(`${window.location.pathname}?page=${lastpage}`, {
      replace: true,
    });
    setCPage(lastpage);
    setTimeout(() => {
      document.getElementById(`c${query.c}`)?.scrollIntoView();
    }, 1);
  }
  const [width] = useWidth();
  const numofpages = roundup((details.c || 0) / 25);
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
        if (details.title && details.slink) {
          !shareOpen && setShareOpen(true);
          shareTitle !== details.title &&
            details.title &&
            setShareTitle(details.title);
          shareLink !== details.slink &&
            details.slink &&
            setShareLink(details.slink);
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
          last={cpage !== 1 && numofpages > 1}
          next={cpage !== numofpages && numofpages > 1}
          pages={numofpages}
          page={cpage}
          onLastClicked={() => {
            changePage(cpage - 1);
          }}
          onNextClicked={() => {
            changePage(cpage + 1);
          }}
          onSelect={(e) => {
            changePage(Number(e.target.value));
          }}
        />
      )}
      {loading && <LinearProgress className="fullwidth" color="secondary" />}
      <Title category={details.category} title={details.title} btns={btns} />
      <Paper
        id="croot"
        key={n}
        className={`overflow-auto nobgimage noshadow conversation-paper${
          loading ? "-loading" : ""
        }`}
        sx={{ bgcolor: "primary.dark" }}
        onScroll={onScroll}
      >
        <Box className="fullwidth max-height-full max-width-full">
          <PhotoProvider>
            {ready &&
              [...Array(pages)].map((p, index) => (
                <Box>
                  <VisibilityDetector
                    onVisibilityChange={(isVisible) => {
                      const croot = document.getElementById("croot");
                      let page = roundup(conversation[0].id / 25) + index;
                      if (isVisible) {
                        lastHeight.current =
                          croot?.scrollTop || lastHeight.current;
                        if (page !== Number(query.page) && page) {
                          navigate(`${window.location.pathname}?page=${page}`, {
                            replace: true,
                          });
                          setCPage(page);
                        }
                      }
                      if (!isVisible && conversation.length) {
                        if (lastHeight.current !== croot?.scrollTop) {
                          page =
                            // @ts-ignore
                            croot.scrollTop > lastHeight.current
                              ? page
                              : page - 1;
                          if (
                            lastHeight.current &&
                            page !== Number(query.page) &&
                            page
                          ) {
                            navigate(
                              `${window.location.pathname}?page=${page}`,
                              {
                                replace: true,
                              }
                            );
                            setCPage(page);
                          }
                        }
                      }
                    }}
                  >
                    <PageTop
                      id={roundup(conversation[0].id / 25) + index}
                      pages={roundup((details.c || 0) / 25)}
                      page={roundup(conversation[0].id / 25) + index}
                      onChange={(e: SelectChangeEvent<number>) => {
                        changePage(Number(e.target.value));
                      }}
                      last={
                        !(
                          roundup(conversation[0].id / 25) + index === 1 &&
                          !index
                        )
                      }
                      next={
                        roundup(conversation[0].id / 25) + index !==
                        roundup((details.c || 0) / 25)
                      }
                      onLastClicked={() => {
                        changePage(
                          roundup(conversation[0].id / 25) + index - 1
                        );
                      }}
                      onNextClicked={() => {
                        changePage(
                          roundup(conversation[0].id / 25) + index + 1
                        );
                      }}
                    />
                  </VisibilityDetector>
                  <ConversationContext.Provider
                    value={{
                      story: [story, setStory],
                      tid: id,
                      title: details.title,
                    }}
                  >
                    {splitarray(
                      conversation,
                      index * 25,
                      (index + 1) * 25 - 1
                    ).map(
                      (comment: any) =>
                        !comment?.removed &&
                        (story ? story === comment?.user : 1) && (
                          <Comment
                            name={users?.[comment?.user].name}
                            id={comment.id}
                            op={users?.[comment?.user].name === details.op}
                            sex={users?.[comment?.user].sex}
                            date={comment?.createdAt}
                            up={comment?.["U"] | 0}
                            down={comment?.["D"] | 0}
                            vote={votes?.[comment.id]}
                            userid={comment?.user}
                            slink={comment?.slink}
                          >
                            {comment?.comment}
                          </Comment>
                        )
                    )}
                  </ConversationContext.Provider>
                </Box>
              ))}
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
export function useTid(): number {
  const { tid } = useContext(ConversationContext);
  return tid;
}
export function useTitle(): string {
  const { title } = useContext(ConversationContext);
  return title;
}
export function useStory(): [number, React.Dispatch<SetStateAction<number>>] {
  const { story } = useContext(ConversationContext);
  return story;
}
export default memo(Conversation);
