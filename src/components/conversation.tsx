import "./css/conversation.css";
import React, { memo, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  LinearProgress,
  Paper,
  SelectChangeEvent,
} from "@mui/material";
import queryString from "query-string";
import Comment from "./comment";
import Title from "./conversation/title";
import axios, { AxiosError } from "axios";
import DOMPurify from "dompurify";
import { roundup, splitarray } from "../lib/common";
import { useNavigate } from "react-router";
import PageTop from "./conversation/pagetop";
import ReactVisibilitySensor from "react-visibility-sensor";
import { useCat, useId } from "./MenuProvider";
import { useNotification } from "./ContextProvider";
import Share from "./conversation/share";
import { ShareProvider } from "./ShareProvider";
/*
 * Conversation component gets data from /api/thread/<thread id(props.id)>/<conversation/users>
 * Then renders it as Comments
 */
function Conversation(props: { id: number }) {
  const query = queryString.parse(window.location.search);
  const [notification, setNotification] = useNotification();
  const [conversation, setConversation] = useState<any>([]);
  const [page, setPage] = useState(Number(query.page) || 1);
  const [users, setUsers] = useState<any>({});
  const [details, setDetails] = useState<any>({});
  const [votes, setVotes] = useState<any>({});
  const [updating, setUpdating] = useState(false);
  const [pages, setPages] = useState(1);
  const [end, setEnd] = useState(false);
  const [n, setN] = useState(Math.random());
  const lastHeight = useRef(0);
  const [cat, setCat] = useCat();
  const [id, setId] = useId();
  const fetching = useRef(false);
  const navigate = useNavigate();
  const onError = function (err: AxiosError) {
    !notification.open &&
      setNotification({
        open: true,
        text: err?.response?.data?.error || err?.response?.data || "",
      });
    err?.response?.status === 404 && navigate("/404", { replace: true });
  };
  !query.page &&
    navigate(`${window.location.pathname}?page=1`, { replace: true });
  useEffect(() => {
    fetching.current = true;
    axios
      .get(`/api/thread/${props.id}?type=1`)
      .then((res) => {
        setDetails(res.data);
        !cat && setCat(res.data.category);
        id !== res.data.id && setId(res.data.id);
        document.title = `${res.data.title} | Metahkg`;
      })
      .catch(onError);
    axios
      .get(`/api/thread/${props.id}?type=0`)
      .then((res) => {
        setUsers(res.data);
      })
      .catch(onError);
    axios
      .get(`/api/thread/${props.id}?type=2&page=${page}`)
      .then((res) => {
        setConversation(res.data);
        res.data.length % 25 && setEnd(true);
      })
      .catch(onError);
    if (localStorage.user) {
      axios
        .get(`/api/getvotes?id=${Number(props.id)}`)
        .then((res) => {
          setVotes(res.data);
        })
        .catch(onError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);
  /**
   * @description get new comments or next page (if last comment id % 25 = 0)
   */
  function update() {
    setUpdating(true);
    axios
      .get(
        `/api/thread/${props.id}?type=2&page=${
          conversation.length % 25 ? page : page + 1
        }`
      )
      .then((res) => {
        if (conversation.length % 25 && res.data.length) {
          const c = conversation;
          for (
            let i =
              res.data.findIndex((n: any) => n.id === c[c.length - 1].id) + 1;
            i < res.data.length;
            i++
          ) {
            c.push(res.data?.[i]);
          }
          lastHeight.current = 0;
          setConversation(c);
          setEnd(true);
        } else if (res.data.length) {
          const c = conversation;
          for (let i = 0; i < res.data.length; i++) {
            c.push(res.data?.[i]);
          }
          setConversation(c);
          setUpdating(false);
          setPage((page) => page + 1);
          setPages(Math.floor((c.length - 1) / 25) + 1);
          navigate(`/thread/${props.id}?page=${page + 1}`, { replace: true });
          document.getElementById(String(page + 1))?.scrollIntoView();
          const croot = document.getElementById("croot");
          if (
            // @ts-ignore
            !(croot?.clientHeight / 5 + 60 >= croot?.clientHeight) &&
            // @ts-ignore
            croot?.scrollHeight - croot?.scrollTop > croot?.clientHeight
          ) {
            // @ts-ignore
            croot.scrollTop -= croot?.clientHeight / 5;
          }
        } else {
          setEnd(true);
        }
        setUpdating(false);
      });
  }
  const ready = !!(
    conversation.length &&
    Object.keys(users).length &&
    Object.keys(details).length &&
    (localStorage.user ? Object.keys(votes).length : 1)
  );
  function changePage(p: number) {
    setConversation([]);
    setPages(1);
    setPage(p);
    lastHeight.current = 0;
    setEnd(false);
    setN(Math.random());
    navigate(`${window.location.pathname}?page=${p}`, { replace: true });
    axios.get(`/api/thread/${props.id}?type=2&page=${p}`).then((res) => {
      setConversation(res.data);
      if (res.data.length % 25) {
        setEnd(true);
      }
      document.getElementById(String(page))?.scrollIntoView();
    });
  }
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
  }
  return (
    <ShareProvider>
      <div className="conversation-root" style={{ minHeight: "100vh" }}>
        <Share />
        {!ready && <LinearProgress className="fullwidth" color="secondary" />}
        <Title
          slink={details.slink}
          category={details.category}
          title={details.title}
        />
        <Paper
          id="croot"
          key={n}
          className="overflow-auto conversation-paper"
          onScroll={onScroll}
        >
          <Box className="fullwidth" sx={{ bgcolor: "primary.dark" }}>
            {ready &&
              [...Array(pages)].map((p, index) => (
                <Box>
                  <ReactVisibilitySensor
                    onChange={(isVisible) => {
                      const croot = document.getElementById("croot");
                      let page = roundup(conversation[0].id / 25) + index;
                      if (isVisible) {
                        lastHeight.current =
                          croot?.scrollTop || lastHeight.current;
                        if (page !== Number(query.page) && page) {
                          navigate(`${window.location.pathname}?page=${page}`, {
                            replace: true,
                          });
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
                              { replace: true }
                            );
                          }
                        }
                      }
                    }}
                  >
                    <PageTop
                      id={roundup(conversation[0].id / 25) + index}
                      pages={roundup(details.c / 25)}
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
                        roundup(details.c / 25)
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
                  </ReactVisibilitySensor>
                  {splitarray(
                    conversation,
                    index * 25,
                    (index + 1) * 25 - 1
                  ).map(
                    (comment: any) =>
                      !comment?.removed && (
                        <Comment
                          name={users?.[comment.user].name}
                          id={comment.id}
                          op={users?.[comment.user].name === details.op}
                          sex={users?.[comment.user].sex}
                          date={comment.createdAt}
                          tid={props.id}
                          up={comment?.["U"] | 0}
                          down={comment?.["D"] | 0}
                          vote={votes?.[comment.id]}
                          userid={comment.user}
                        >
                          {DOMPurify.sanitize(comment?.comment)}
                        </Comment>
                      )
                  )}
                </Box>
              ))}
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
              <CircularProgress color="secondary" />
            )}
          </Box>
        </Paper>
      </div>
    </ShareProvider>
  );
}
export default memo(Conversation);
