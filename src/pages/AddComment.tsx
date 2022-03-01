import "./css/addcomment.css";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Box, Button } from "@mui/material";
import axios from "axios";
import { Navigate, useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import { useNotification, useWidth } from "../components/ContextProvider";
import { useMenu } from "../components/MenuProvider";
import TextEditor from "../components/texteditor";
import { roundup, severity, wholepath } from "../lib/common";
import MetahkgLogo from "../components/icon";
/*
 * AddComment component for /comment/:id adds a comment
 * if user not signed in, he would be redirected to /signin
 * if thread with the specified id is not found, user would be redirected to /
 * Renders a tinymce editor for editing comment
 * if localStorage.reply exists, tinymce's initial content is set to localStorage.reply
 * captcha not needed
 */
export default function AddComment() {
  const navigate = useNavigate();
  const [menu, setMenu] = useMenu();
  const [width] = useWidth();
  const [comment, setComment] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [alert, setAlert] = useState<{ severity: severity; text: string }>({
    severity: "info",
    text: "",
  });
  const [, setNotification] = useNotification();
  const inittext = useRef("");
  const params = useParams();
  useEffect(() => {
    if (localStorage.user) {
      axios.post("/api/check", { id: id }).catch((err) => {
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
  function addcomment() {
    //send data to server /api/comment
    setDisabled(true);
    setAlert({ severity: "info", text: "Adding comment..." });
    axios
      .post("/api/comment", { id: id, comment: comment })
      .then((res) => {
        navigate(`/thread/${id}?page=${roundup(res.data.id / 25)}`);
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
      });
  }
  if (!localStorage.user) {
    return <Navigate to={`/signin?continue=true&returnto=${encodeURIComponent(wholepath())}`} replace/>
  }
  const id = Number(params.id);
  menu && setMenu(false);
  document.title = "Comment | Metahkg";
  if (localStorage.reply && localStorage.user) {
    inittext.current = `<blockquote style="color: #aca9a9; border-left: 2px solid #aca9a9; margin-left: 0"><div style="margin-left: 15px">${localStorage.reply}</div></blockquote><p></p>`;
    localStorage.removeItem("reply");
  }
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
          <h4 className="mt5 mb10 ac-target">
            target: thread{" "}
            <Link to={`/thread/${id}`} target="_blank" rel="noreferrer">
              {id}
            </Link>
          </h4>
          {alert.text && (
            <Alert className="mt10 mb15" severity={alert.severity}>
              {alert.text}
            </Alert>
          )}
          <TextEditor
            key={id}
            text={inittext.current}
            changehandler={(v, e: any) => {
              setComment(e.getContent());
            }}
          />
          <Button
            disabled={disabled || !comment}
            className="mt20 ac-btn"
            onClick={addcomment}
            variant="contained"
            color="secondary"
          >
            Comment
          </Button>
        </div>
      </div>
    </Box>
  );
}
