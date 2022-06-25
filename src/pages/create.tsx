import "./css/create.css";
import React, { useEffect, useState } from "react";
import { Alert, Box, Button, TextField, Tooltip } from "@mui/material";
import { Create as CreateIcon } from "@mui/icons-material";
import TextEditor from "../components/texteditor";
import ReCAPTCHA from "react-google-recaptcha";
import { Navigate, useNavigate } from "react-router-dom";
import queryString from "query-string";
import {
    useCat,
    useData,
    useMenu,
    useProfile,
    useRecall,
    useSearch,
    useMenuTitle,
} from "../components/MenuProvider";
import {
    useIsSmallScreen,
    useNotification,
    useUser,
    useWidth,
} from "../components/ContextProvider";
import { reCaptchaSiteKey, setTitle, wholePath } from "../lib/common";
import { severity } from "../types/severity";
import MetahkgLogo from "../components/logo";
import UploadImage from "../components/uploadimage";
import { api } from "../lib/api";
import type { TinyMCE } from "tinymce";
import ChooseCat from "../components/create/ChooseCat";

declare const tinymce: TinyMCE;
declare const grecaptcha: { reset: () => void };

/**
 * Page for creating a new thread
 */
export default function Create() {
    setTitle("Create thread | Metahkg");
    const navigate = useNavigate();
    const query = queryString.parse(window.location.search);
    const [menu, setMenu] = useMenu();
    const isSmallScreen = useIsSmallScreen();
    const [width] = useWidth();
    const [profile, setProfile] = useProfile();
    const [cat, setCat] = useCat();
    const [search, setSearch] = useSearch();
    const [recall, setRecall] = useRecall();
    const [data, setData] = useData();
    const [mtitle, setMtitle] = useMenuTitle();
    const [, setNotification] = useNotification();
    const [catchoosed, setCatchoosed] = useState<number>(cat || 1);
    const [rtoken, setRtoken] = useState(""); //recaptcha token
    const [postTitle, setPostTitle] = useState(""); //this will be the post title
    const [imgurl, setImgurl] = useState("");
    const [comment, setComment] = useState(""); //initial comment (#1)
    const [disabled, setDisabled] = useState(false);
    const [alert, setAlert] = useState<{ severity: severity; text: string }>({
        severity: "info",
        text: "",
    });
    const quote = {
        threadId: Number(String(query.quote).split(".")[0]),
        commentId: Number(String(query.quote).split(".")[1]),
    };
    const [inittext, setInittext] = useState("");
    const [user] = useUser();

    useEffect(() => {
        if (user && quote.threadId && quote.commentId) {
            setAlert({ severity: "info", text: "Fetching comment..." });
            setNotification({ open: true, text: "Fetching comment..." });
            api.threads.comments
                .get({ threadId: quote.threadId, commentId: quote.commentId })
                .then((res) => {
                    if (res.data) {
                        setInittext(
                            `<blockquote style="color: #aca9a9; border-left: 2px solid #646262; margin-left: 0"><div style="margin-left: 15px">${res.data}</div></blockquote><p></p>`
                        );
                        setAlert({ severity: "info", text: "" });
                        setTimeout(() => {
                            setNotification({ open: false, text: "" });
                        }, 1000);
                    } else {
                        setAlert({ severity: "error", text: "Comment not found!" });
                        setNotification({ open: true, text: "Comment not found!" });
                    }
                })
                .catch(() => {
                    setAlert({
                        severity: "warning",
                        text: "Unable to fetch comment. This comment would not be a quote.",
                    });
                    setNotification({
                        open: true,
                        text: "Unable to fetch comment. This comment would not be a quote.",
                    });
                });
        }
    }, [quote.commentId, quote.threadId, setNotification, user]);

    function create() {
        setAlert({ severity: "info", text: "Creating thread..." });
        setNotification({ open: true, text: "Creating thread..." });
        setDisabled(true);
        api.threads
            .create({
                title: postTitle,
                category: catchoosed,
                comment: comment,
                rtoken: rtoken,
            })
            .then((res) => {
                cat && setCat(0);
                search && setSearch(false);
                recall && setRecall(false);
                profile && setProfile(0);
                data.length && setData([]);
                mtitle && setMtitle("");
                navigate(`/thread/${res.data.id}`, { replace: true });
                setTimeout(() => {
                    setNotification({ open: false, text: "" });
                }, 100);
            })
            .catch((err) => {
                setAlert({
                    severity: "error",
                    text: err?.response?.data?.error || err?.response?.data || "",
                });
                setNotification({
                    open: true,
                    text: err?.response?.data?.error || err?.response?.data || "",
                });
                setDisabled(false);
                setRtoken("");
                grecaptcha.reset();
            });
    }

    menu && setMenu(false);

    if (!user)
        return (
            <Navigate
                to={`/users/login?continue=true&returnto=${encodeURIComponent(
                    wholePath()
                )}`}
                replace
            />
        );

    const isSmallSmallScreen = width * 0.8 - 40 <= 450;

    return (
        <Box
            className="flex fullwidth min-height-fullvh justify-center max-width-full"
            sx={{
                backgroundColor: "primary.dark",
            }}
        >
            <div style={{ width: isSmallSmallScreen ? "100vw" : "80vw" }}>
                <div className="m20">
                    <div className="flex align-center">
                        <MetahkgLogo
                            svg
                            height={50}
                            width={40}
                            light
                            className="mr10 mb10"
                        />
                        <h1>Create thread</h1>
                    </div>
                    {alert.text && (
                        <Alert className="mb15" severity={alert.severity}>
                            {alert.text}
                        </Alert>
                    )}
                    <div className={isSmallScreen ? "" : "flex "}>
                        <ChooseCat cat={catchoosed} setCat={setCatchoosed} />
                        <TextField
                            className={isSmallScreen ? "mt15" : "ml15"}
                            variant="filled"
                            color="secondary"
                            fullWidth
                            label="Title"
                            onChange={(e) => {
                                setPostTitle(e.target.value);
                            }}
                        />
                    </div>
                    <div
                        className={`${
                            !isSmallScreen ? "flex" : ""
                        } align-center mb15 mt15`}
                    >
                        <UploadImage
                            onUpload={() => {
                                setAlert({
                                    severity: "info",
                                    text: "Uploading image...",
                                });
                                setNotification({
                                    open: true,
                                    text: "Uploading image...",
                                });
                            }}
                            onSuccess={(res) => {
                                setAlert({ severity: "info", text: "Image uploaded!" });
                                setNotification({ open: true, text: "Image uploaded!" });
                                setTimeout(() => {
                                    setNotification({ open: false, text: "" });
                                }, 1000);
                                setImgurl(res.data.url);
                                tinymce.activeEditor.insertContent(
                                    `<a href="${res.data.url}" target="_blank" rel="noreferrer">
                                                <img
                                                    alt=""
                                                    src="${res.data.url}"
                                                    width="auto"
                                                    height="auto"
                                                    style="object-fit: contain; max-height: 400px; max-width: 100%;"
                                                />
                                            </a>`
                                );
                            }}
                            onError={() => {
                                setAlert({
                                    severity: "error",
                                    text: "Error uploading image.",
                                });
                                setNotification({
                                    open: true,
                                    text: "Error uploading image.",
                                });
                            }}
                        />
                        {imgurl && (
                            <p
                                className={`ml10 novmargin flex${
                                    isSmallScreen ? " mt5" : ""
                                }`}
                            >
                                <Tooltip
                                    arrow
                                    title={
                                        <img
                                            src={`https://i.metahkg.org/thumbnail?src=${imgurl}`}
                                            alt=""
                                        />
                                    }
                                >
                                    <a href={imgurl} target="_blank" rel="noreferrer">
                                        {imgurl}
                                    </a>
                                </Tooltip>
                                <p
                                    className="link novmargin metahkg-grey-force ml5"
                                    onClick={() => {
                                        navigator.clipboard.writeText(imgurl);
                                        setNotification({
                                            open: true,
                                            text: "Copied to clipboard!",
                                        });
                                    }}
                                >
                                    copy
                                </p>
                            </p>
                        )}
                    </div>
                    <TextEditor
                        onChange={(v, e: any) => {
                            setComment(e.getContent());
                        }}
                        initText={inittext}
                    />
                    <div
                        className={`mt15 ${
                            isSmallSmallScreen
                                ? ""
                                : "flex fullwidth justify-space-between align-center"
                        }`}
                    >
                        <ReCAPTCHA
                            theme="dark"
                            sitekey={reCaptchaSiteKey}
                            onChange={(token) => {
                                setRtoken(token || "");
                            }}
                        />
                        <Button
                            disabled={
                                disabled ||
                                !(comment && postTitle && rtoken && catchoosed)
                            }
                            className={`${
                                isSmallSmallScreen ? "mt15 " : ""
                            }font-size-16-force create-btn novpadding notexttransform`}
                            onClick={create}
                            variant="contained"
                            color="secondary"
                        >
                            <CreateIcon className="mr5 font-size-16-force" />
                            Create
                        </Button>
                    </div>
                </div>
            </div>
        </Box>
    );
}
