import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    useCat,
    useData,
    useId,
    useProfile,
    useRecall,
    useSearch,
    useSelected,
    useSmode,
} from "../MenuProvider";
import { useHistory, useNotification, useQuery } from "../ContextProvider";
import { AxiosError } from "axios";
import { splitArray } from "../../lib/common";
import { api } from "../../lib/api";
import { summary } from "../../types/conversation/summary";
import { Box, Divider, Paper, Typography } from "@mui/material";
import MenuThread from "./menuThread";
import MenuPreload from "./menuPreload";

/**
 * This function renders the main content of the menu
 */
export default function MenuBody() {
    const navigate = useNavigate();
    const [category] = useCat();
    const [search] = useSearch();
    const [profile] = useProfile();
    const [selected] = useSelected();
    const [recall] = useRecall();
    const [query] = useQuery();
    const [, setNotification] = useNotification();
    const [id] = useId();
    const [data, setData] = useData();
    const [smode] = useSmode();
    const [page, setPage] = useState(1);
    const [end, setEnd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useHistory();
    const paperRef = useRef<HTMLDivElement>(null);

    const categoryKey: string | number = category || `bytid${id}`;

    /**
     * It sets the notification state to an object with the open property set to true and the text
     * property set to the error message.
     * @param {AxiosError} err - The error object.
     */
    function onError(err: AxiosError) {
        setNotification({
            open: true,
            text: err?.response?.data?.error || err?.response?.data || "",
        });
        err?.response?.status === 404 && navigate("/404", { replace: true });
        err?.response?.status === 401 && navigate("/401", { replace: true });
    }

    const mode =
        (search && "search") || (profile && "profile") || (recall && "recall") || "menu";
    /* A way to make sure that the effect is only run once. */
    useEffect(() => {
        if (!data.length && (category || profile || (search && query) || id || recall)) {
            setEnd(false);
            setLoading(true);
            const url = {
                search: `/search?q=${encodeURIComponent(
                    query
                )}&sort=${selected}&mode=${smode}`,
                profile: `/history/${profile}?sort=${selected}`,
                menu: `/menu/${categoryKey}?sort=${selected}`,
                recall: `/threads?threads=${JSON.stringify(
                    splitArray(
                        history.map((item) => item.id),
                        0,
                        24
                    )
                )}`,
            }[mode];
            api.get(url)
                .then((res) => {
                    !(page === 1) && setPage(1);
                    res.data.length && setData(res.data);
                    res.data.length < 25 && setEnd(true);
                    setLoading(false);
                    setTimeout(() => {
                        if (paperRef.current) paperRef.current.scrollTop = 0;
                    });
                })
                .catch(onError);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, recall, profile, data, selected, category]);

    useEffect(() => {
        if (query && search) setData([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, search]);

    /**
     * It updates the data array with the new data from the API.
     */
    function update() {
        setEnd(false);
        setLoading(true);
        const url = {
            search: `/search?q=${encodeURIComponent(query)}&sort=${selected}&page=${
                page + 1
            }&mode=${smode}`,
            profile: `/history/${profile}?sort=${selected}&page=${page + 1}`,
            menu: `/menu/${categoryKey}?sort=${selected}&page=${page + 1}`,
            recall: `/threads?threads=${JSON.stringify(
                splitArray(
                    history.map((item) => item.id),
                    page * 25,
                    (page + 1) * 25 - 1
                )
            )}`,
        }[mode];
        api.get(url)
            .then((res: { data: summary[] }) => {
                setData([...data, ...res.data]);
                res.data.length < 25 && setEnd(true);
                setPage((page) => page + 1);
                setLoading(false);
            })
            .catch(onError);
    }

    /**
     * If the user has scrolled to the bottom of the page, update the list
     * @param {any} e - The event object.
     */
    function onScroll(e: any) {
        if (!end && !loading) {
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

    if (search && !query)
        return (
            <Typography className={"text-align-center mt10"} color={"secondary"}>
                Please enter a query.
            </Typography>
        );

    return (
        <Paper
            className="nobgimage noshadow overflow-auto"
            style={{
                maxHeight: `calc(100vh - ${
                    (search && "151") || (recall && "51") || "91"
                }px)`,
            }}
            onScroll={onScroll}
            ref={paperRef}
        >
            <Box className="min-height-full menu-bottom flex flex-dir-column">
                {Boolean(data.length) && (
                    <Box className="flex flex-dir-column max-width-full menu-bottom">
                        {data.map((thread: summary, index) => (
                            <div key={index}>
                                <MenuThread
                                    key={`${category}${id === thread.id}`}
                                    thread={thread}
                                    onClick={() => {
                                        const index = history.findIndex(
                                            (i) => i.id === thread.id
                                        );
                                        if (index === -1) {
                                            history.unshift({
                                                id: thread.id,
                                                c: thread.c,
                                                cid: 1,
                                            });
                                            setHistory(history);
                                            localStorage.setItem(
                                                "history",
                                                JSON.stringify(history)
                                            );
                                        } else if (history[index].cid < thread.c) {
                                            history[index].c = thread.c;
                                            setHistory(history);
                                            localStorage.setItem(
                                                "history",
                                                JSON.stringify(history)
                                            );
                                        }
                                    }}
                                />
                                <Divider />
                            </div>
                        ))}
                    </Box>
                )}
                {loading && <MenuPreload />}
                {end && (
                    <Typography
                        className="mt10 mb10 text-align-center font-size-20-force"
                        sx={{
                            color: "secondary.main",
                        }}
                    >
                        End
                    </Typography>
                )}
            </Box>
        </Paper>
    );
}
