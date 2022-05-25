import "./css/addcomment.css";
import React, { useEffect, useState } from "react";
import { Alert, Box, Button, Tooltip } from "@mui/material";
import { AddComment as AddCommentIcon } from "@mui/icons-material";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import ReactDOMServer from "react-dom/server";
import {
    useNotification,
    useUser,
    useIsSmallScreen,
    useWidth,
} from "../components/ContextProvider";
import { useData, useMenu } from "../components/MenuProvider";
import TextEditor from "../components/texteditor";
import { roundup, setTitle, wholePath } from "../lib/common";
import { severity } from "../types/severity";
import MetahkgLogo from "../components/logo";
import queryString from "query-string";
import ReCAPTCHA from "react-google-recaptcha";
import UploadImage from "../components/uploadimage";
import { api } from "../lib/api";
import type { TinyMCE } from "tinymce";
import RenderComment from "../components/renderComment";
import { commentType } from "../types/conversation/comment";

declare const tinymce: TinyMCE;
declare const grecaptcha: { reset: () => void };
/**
 * This page is used to add a comment to a thread
 */
export default function AddComment() {
    setTitle("Comment | Metahkg");
    const navigate = useNavigate();
    const [menu, setMenu] = useMenu();
    const [data, setData] = useData();
    const isSmallScreen = useIsSmallScreen();
    const [width] = useWidth();
    const [comment, setComment] = useState("");
    const [imgUrl, setImgUrl] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [rtoken, setRtoken] = useState("");
    const [initText, setInitText] = useState("");
    const [alert, setAlert] = useState<{ severity: severity; text: string }>({
        severity: "info",
        text: "",
    });
    const [, setNotification] = useNotification();
    const [user] = useUser();
    const query = queryString.parse(window.location.search);
    const edit = Number(query.edit);
    const quote = Number(query.quote);
    const params = useParams();
    const id = Number(params.id);

    useEffect(() => {
        if (user) {
            api.post("/posts/check", { id: id }).catch((err) => {
                if (err.response.status === 404) {
                    setAlert({
                        severity: "warning",
                        text: "Thread not found. Redirecting you to the homepage in 5 seconds.",
                    });
                    setNotification({
                        open: true,
                        text: "Thread not found. Redirecting you to the homepage in 5 seconds.",
                    });
                    setTimeout(() => {
                        navigate("/", { replace: true });
                    }, 5000);
                } else {
                    setAlert({
                        severity: "error",
                        text: err?.response?.data?.error || err?.response?.data || "",
                    });
                    setNotification({
                        open: true,
                        text: err?.response?.data?.error || err?.response?.data || "",
                    });
                }
            });
            edit &&
                api
                    .get(`/posts/thread/${id}/comment/${edit}`)
                    .then((res: { data: commentType }) => {
                        setInitText(
                            `<blockquote style="color: #aca9a9; border-left: 2px solid #646262; margin-left: 0"><div style="margin-left: 15px">${ReactDOMServer.renderToStaticMarkup(
                                <RenderComment comment={res.data} depth={0} />
                            )}</div></blockquote><p></p>`
                        );
                        setAlert({ severity: "info", text: "" });
                        setTimeout(() => {
                            setNotification({ open: false, text: "" });
                        }, 500);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * It sends a post request to the server with the comment data.
     */
    function addComment() {
        //send data to server /api/posts/comment
        setDisabled(true);
        setAlert({ severity: "info", text: "Adding comment..." });
        setNotification({ open: true, text: "Adding comment..." });
        api.post("/posts/comment", {
            id,
            comment,
            rtoken,
            quote,
        })
            .then((res) => {
                data.length && setData([]);
                navigate(
                    `/thread/${id}?page=${roundup(res.data.id / 25)}&c=${res.data.id}`,
                    { replace: true }
                );
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

    /* It checks if the user is logged in. If not, it redirects the user to the signin page. */
    if (!user)
        return (
            <Navigate
                to={`/users/signin?continue=true&returnto=${encodeURIComponent(
                    wholePath()
                )}`}
                replace
            />
        );

    menu && setMenu(false);

    const isSmallSmallScreen = width * 0.8 - 40 <= 450;

    return (
        <Box
            className="min-height-fullvh flex justify-center fullwidth align-center"
            sx={{
                bgcolor: "primary.dark",
            }}
        >
            <div style={{ width: isSmallScreen ? "100vw" : "80vw" }}>
                <div className="m20">
                    <div className="flex align-center">
                        <MetahkgLogo
                            svg
                            height={50}
                            width={40}
                            light
                            className="mr10 mb10"
                        />
                        <h1 className="nomargin">Add comment</h1>
                    </div>
                    <h4 className="mt5 mb10 font-size-22">
                        {quote ? "Reply to comment #" : "target: thread "}
                        <Link
                            to={`/thread/${id}${quote && `?c=${quote}`}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {quote || id}
                        </Link>
                    </h4>
                    {alert.text && (
                        <Alert className="mb10" severity={alert.severity}>
                            {alert.text}
                        </Alert>
                    )}
                    <div className={`${!isSmallScreen ? "flex" : ""} align-center mb15`}>
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
                                setImgUrl(res.data.url);
                                tinymce.activeEditor.insertContent(
                                    `<img src="${res.data.url}" width="auto" height="auto" style="object-fit: contain; max-height: 400px; max-width: 100%;" alt=""/>`
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
                        {imgUrl && (
                            <p
                                className={`ml10 novmargin flex${
                                    isSmallScreen ? " mt5" : ""
                                }`}
                            >
                                <Tooltip
                                    arrow
                                    title={
                                        <img
                                            src={`https://i.metahkg.org/thumbnail?src=${imgUrl}`}
                                            alt=""
                                        />
                                    }
                                >
                                    <a href={imgUrl} target="_blank" rel="noreferrer">
                                        {imgUrl}
                                    </a>
                                </Tooltip>
                                <p
                                    className="link novmargin metahkg-grey-force ml5"
                                    onClick={() => {
                                        navigator.clipboard.writeText(imgUrl);
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
                        key={id}
                        onChange={(v, e: any) => {
                            setComment(e.getContent());
                        }}
                        text={edit ? initText : undefined}
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
                            sitekey={
                                process.env.REACT_APP_recaptchasitekey ||
                                "6LcX4bceAAAAAIoJGHRxojepKDqqVLdH9_JxHQJ-"
                            }
                            onChange={(token) => {
                                setRtoken(token || "");
                            }}
                        />
                        <Button
                            disabled={disabled || !comment || !rtoken}
                            className={`${
                                isSmallSmallScreen ? "mt15 " : ""
                            }font-size-16-force notexttransform ac-btn`}
                            onClick={addComment}
                            variant="contained"
                            color="secondary"
                        >
                            <AddCommentIcon className="mr5 font-size-16-force" />
                            Comment
                        </Button>
                    </div>
                </div>
            </div>
        </Box>
    );
}
