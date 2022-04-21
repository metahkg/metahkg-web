import "./css/addcomment.css";
import React, { useEffect, useState } from "react";
import { Alert, Box, Button, Tooltip } from "@mui/material";
import { AddComment as AddCommentIcon } from "@mui/icons-material";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useNotification, useWidth } from "../components/ContextProvider";
import { useData, useMenu } from "../components/MenuProvider";
import TextEditor from "../components/texteditor";
import { roundup, wholepath } from "../lib/common";
import { severity } from "../types/severity";
import MetahkgLogo from "../components/logo";
import queryString from "query-string";
import ReCAPTCHA from "react-google-recaptcha";
import UploadImage from "../components/uploadimage";
import { api } from "../lib/api";

declare const tinymce: any;
declare const grecaptcha: { reset: () => void };
/**
 * This page is used to add a comment to a thread
 */
export default function AddComment() {
    const navigate = useNavigate();
    const [menu, setMenu] = useMenu();
    const [data, setData] = useData();
    const [width] = useWidth();
    const [comment, setComment] = useState("");
    const [imgurl, setImgurl] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [rtoken, setRtoken] = useState("");
    const [alert, setAlert] = useState<{ severity: severity; text: string }>({
        severity: "info",
        text: "",
    });
    const [, setNotification] = useNotification();
    const query = queryString.parse(window.location.search);
    const quote = Number(query.quote);
    useEffect(() => {
        if (localStorage.user) {
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
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * It sends a post request to the server with the comment data.
     */
    const params = useParams();
    function addcomment() {
        //send data to server /api/posts/comment
        setDisabled(true);
        setAlert({ severity: "info", text: "Adding comment..." });
        setNotification({ open: true, text: "Adding comment..." });
        api.post("/posts/comment", {
            id: id,
            comment: comment,
            rtoken: rtoken,
            quote: quote || undefined,
        })
            .then((res) => {
                data.length && setData([]);
                navigate(
                    `/thread/${id}?page=${roundup(res.data.id / 25)}&c=${res.data.id}`
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
    if (!localStorage.user) {
        return (
            <Navigate
                to={`/users/signin?continue=true&returnto=${encodeURIComponent(
                    wholepath()
                )}`}
                replace
            />
        );
    }
    const id = Number(params.id);
    menu && setMenu(false);
    document.title = "Comment | Metahkg";
    const small = width * 0.8 - 40 <= 450;
    return (
        <Box
            className="min-height-fullvh flex justify-center fullwidth align-center"
            sx={{
                bgcolor: "primary.dark",
            }}
        >
            <div style={{ width: width < 760 ? "100vw" : "80vw" }}>
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
                        target: thread{" "}
                        <Link to={`/thread/${id}`} target="_blank" rel="noreferrer">
                            {id}
                        </Link>
                    </h4>
                    {alert.text && (
                        <Alert className="mb10" severity={alert.severity}>
                            {alert.text}
                        </Alert>
                    )}
                    <div className={`${!(width < 760) ? "flex" : ""} align-center mb15`}>
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
                                    `<a href="${res.data.url}" target="_blank" rel="noreferrer"><img src="${res.data.url}" width="auto" height="auto" style="object-fit: contain; max-height: 400px; max-width: 100%;" /></a>`
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
                                    width < 760 ? " mt5" : ""
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
                        key={id}
                        changehandler={(v, e: any) => {
                            setComment(e.getContent());
                        }}
                    />
                    <div
                        className={`mt15 ${
                            small
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
                                small ? "mt15 " : ""
                            }font-size-16-force notexttransform ac-btn`}
                            onClick={addcomment}
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
