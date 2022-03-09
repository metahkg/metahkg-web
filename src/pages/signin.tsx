import "./css/signin.css";
import React, { useEffect, useState } from "react";
import { Alert, Box, Button, TextField } from "@mui/material";
import axios from "axios";
import hash from "hash.js";
import { Link } from "react-router-dom";
import { Navigate, useNavigate } from "react-router";
import queryString from "query-string";
import { useMenu } from "../components/MenuProvider";
import { useNotification, useWidth } from "../components/ContextProvider";
import { severity } from "../lib/common";
import MetahkgLogo from "../components/logo";
import { Login as LoginIcon } from "@mui/icons-material";
/**
 * /signin
 * The Signin component collects data from user then send to the server /api/signin
 * If sign in is successful, a cookie "key" would be set by the server, which is the api key
 * If user is already signed in, he is redirected to /
 * After signing in, user is redirected to query.returnto if it exists, otherwise /
 */
export default function Signin() {
  const navigate = useNavigate();
  const [menu, setMenu] = useMenu();
  const [, setNotification] = useNotification();
  const [width] = useWidth();
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [alert, setAlert] = useState<{ severity: severity; text: string }>({
    severity: "info",
    text: "",
  });
  useEffect(() => {
    if (query?.continue) {
      setAlert({ severity: "info", text: "Sign in to continue." });
      setNotification({ open: true, text: "Sign in to continue." });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (localStorage.user) {
    return <Navigate to="/" replace />;
  }
  menu && setMenu(false);
  document.title = "Sign in | Metahkg";
  const query = queryString.parse(window.location.search);
  function signin() {
    setAlert({ severity: "info", text: "Signing in..." });
    setDisabled(true);
    axios
      .post("/api/signin", {
        user: user,
        pwd: hash.sha256().update(pwd).digest("hex"),
      })
      .then((res) => {
        localStorage.user = res.data.user;
        localStorage.id = res.data.id;
        navigate(decodeURIComponent(String(query.returnto || "/")), {
          replace: true,
        });
        setNotification({ open:true, text: `Signed in as ${res.data.user}.`});
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
  return (
    <Box
      className="flex align-center justify-center fullwidth min-height-fullvh"
      sx={{
        backgroundColor: "primary.dark",
      }}
    >
      <Box
        className="signin-main-box"
        sx={{
          width: width < 760 ? "100vw" : "50vw",
        }}
      >
        <div className="ml50 mr50">
          <div className="flex fullwidth justify-flex-end">
            <Link
              className="notextdecoration"
              to={`/register${window.location.search}`}
              replace
            >
              <Button
                className="flex notexttransform font-size-18-force"
                color="secondary"
                variant="text"
              >
                <strong>Register</strong>
              </Button>
            </Link>
          </div>
          <div className="flex justify-center align-center">
            <MetahkgLogo height={50} width={40} svg light className="mb10" />
            <h1 className="font-size-25 mb20">Sign in</h1>
          </div>
          {alert.text && (
            <Alert className="mb15 mt10" severity={alert.severity}>
              {alert.text}
            </Alert>
          )}
          <TextField
            className="mb20"
            color="secondary"
            type="text"
            label="Username / Email"
            variant="filled"
            onChange={(e) => {
              setUser(e.target.value);
            }}
            required
            fullWidth
          />
          <TextField
            className="mb20"
            color="secondary"
            type="password"
            label="Password"
            variant="filled"
            onChange={(e) => {
              setPwd(e.target.value);
            }}
            required
            fullWidth
          />
          <br />
          <Button
            disabled={disabled || !(user && pwd)}
            className="mt10 font-size-16-force notexttransform signin-btn"
            color="secondary"
            variant="contained"
            onClick={signin}
          >
            <LoginIcon className="mr5 font-size-16-force" />
            Sign in
          </Button>
        </div>
      </Box>
    </Box>
  );
}
