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

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Alert, Box, TextField, Typography } from "@mui/material";
import { Create as CreateIcon } from "@mui/icons-material";
import TextEditor from "../components/textEditor";
import CAPTCHA, { CaptchaRefProps } from "../lib/Captcha";
import { Navigate, useNavigate } from "react-router-dom";
import queryString from "query-string";
import { useCat, useMenu } from "../components/MenuProvider";
import {
    useDarkMode,
    useIsSmallScreen,
    useNotification,
    useServerConfig,
    useUser,
} from "../components/AppContextProvider";
import { setTitle, wholePath } from "../lib/common";
import { severity } from "../types/severity";
import MetahkgLogo from "../components/logo";
import { api } from "../lib/api";
import ChooseCat from "../components/create/ChooseCat";
import { parseError } from "../lib/parseError";
import ReCaptchaNotice from "../lib/reCaptchaNotice";
import { clearTinymceDraft } from "../lib/clearTinymceDraft";
import { LoadingButton } from "@mui/lab";

/**
 * Page for creating a new thread
 */
export default function Create() {
    const navigate = useNavigate();
    const query = queryString.parse(window.location.search);
    const [menu, setMenu] = useMenu();
    const isSmallScreen = useIsSmallScreen();
    const [cat] = useCat();
    const [notification, setNotification] = useNotification();
    const [catchoosed, setCatchoosed] = useState<number>(cat || 1);
    const [threadTitle, setThreadTitle] = useState(""); //this will be the post title
    const [comment, setComment] = useState(""); //initial comment (#1)
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{ severity: severity; text: string }>({
        severity: "info",
        text: "",
    });
    const darkMode = useDarkMode();
    const captchaRef = useRef<CaptchaRefProps>(null);

    const quote = {
        threadId: Number(String(query.quote).split(".")[0]),
        commentId: Number(String(query.quote).split(".")[1]),
    };

    const [inittext, setInittext] = useState("");
    const [user] = useUser();
    const [serverConfig] = useServerConfig();

    useLayoutEffect(() => {
        setTitle("Create thread | Metahkg");
        menu && setMenu(false);
    }, [menu, setMenu, user]);

    useEffect(() => {
        if (user && quote.threadId && quote.commentId) {
            setAlert({ severity: "info", text: "Fetching comment..." });
            setNotification({
                open: true,
                severity: "info",
                text: "Fetching comment...",
            });
            api.comment(quote.threadId, quote.commentId)
                .then((data) => {
                    if (data) {
                        setInittext(/*html*/ `<blockquote style="color: #aca9a9; border-left: 2px solid ${
                            darkMode ? "#646262" : "e7e7e7"
                        }; margin-left: 0">
                                        <div style="margin-left: 15px">
                                            ${data.comment}
                                        </div>
                                    </blockquote>
                                    <p></p>`);
                        setAlert({ severity: "info", text: "" });
                        setTimeout(() => {
                            if (notification.open)
                                setNotification({ open: false, text: "" });
                        }, 500);
                    } else {
                        setAlert({ severity: "error", text: "Comment not found!" });
                        setNotification({
                            open: true,
                            severity: "error",
                            text: "Comment not found!",
                        });
                    }
                })
                .catch(() => {
                    const text =
                        "Unable to fetch comment. This comment would not be a quote.";
                    setAlert({ severity: "warning", text });
                    setNotification({ open: true, severity: "warning", text });
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!user)
        return (
            <Navigate
                to={`/users/login?continue=true&returnto=${encodeURIComponent(
                    wholePath()
                )}`}
                replace
            />
        );

    async function onSubmit(e?: React.FormEvent<HTMLFormElement>) {
        e?.preventDefault();
        if (serverConfig?.captcha === "turnstile") {
            setLoading(true);
        }
        const captchaToken = await captchaRef.current?.executeAsync();
        if (!captchaToken) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setAlert({ severity: "info", text: "Creating thread..." });
        setNotification({ open: true, severity: "info", text: "Creating thread..." });
        api.threadCreate({
            title: threadTitle,
            category: catchoosed,
            comment,
            captchaToken,
        })
            .then((data) => {
                clearTinymceDraft(window.location.pathname);
                navigate(`/thread/${data.id}`, { replace: true });
                setTimeout(() => {
                    notification.open && setNotification({ open: false, text: "" });
                }, 100);
            })
            .catch((err) => {
                const text = parseError(err);
                setAlert({ severity: "error", text });
                setNotification({ open: true, severity: "error", text });
                setLoading(false);
                captchaRef.current?.reset();
            });
    }

    return (
        <Box
            className="flex w-full min-h-screen justify-center max-w-full"
            sx={{
                backgroundColor: "primary.dark",
            }}
        >
            <Box className={isSmallScreen ? "w-100v" : "w-80v"}>
                <Box className="m-5" component="form" onSubmit={onSubmit}>
                    <Box className="flex items-center my-4">
                        <MetahkgLogo
                            svg
                            height={50}
                            width={40}
                            light={darkMode}
                            className="!mr-2 !mb-2"
                        />
                        <Typography variant="h4">Create thread</Typography>
                    </Box>
                    {alert.text && (
                        <Alert className="!mb-4" severity={alert.severity}>
                            {alert.text}
                        </Alert>
                    )}
                    <Box className={`mb-4 ${isSmallScreen ? "" : "flex "}`}>
                        <ChooseCat cat={catchoosed} setCat={setCatchoosed} />
                        <TextField
                            className={isSmallScreen ? "!mt-4" : "!ml-4"}
                            variant="filled"
                            color="secondary"
                            fullWidth
                            label="Title"
                            onChange={(e) => {
                                setThreadTitle(e.target.value);
                            }}
                        />
                    </Box>
                    <TextEditor
                        onChange={(_v, e: any) => {
                            setComment(e.getContent());
                        }}
                        initText={inittext}
                        toolbarSticky
                        autoResize
                        lengthLimit={50000}
                        minHeight={isSmallScreen ? 310 : 350}
                    />
                    <Box className="mt-4">
                        <CAPTCHA ref={captchaRef} />
                        <LoadingButton
                            disabled={loading || !(comment && threadTitle && catchoosed)}
                            loading={loading}
                            className={"text-4 !h-10 !py-0 !normal-case"}
                            variant="contained"
                            color="secondary"
                            type="submit"
                            startIcon={<CreateIcon className="!text-4" />}
                            loadingPosition="start"
                        >
                            Create
                        </LoadingButton>
                        <ReCaptchaNotice className="!mt-[10px]" />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
