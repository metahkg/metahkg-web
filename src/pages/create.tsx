import "./css/create.css";
import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import TextEditor from "../components/texteditor";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import axios from "axios";
import { Navigate, useNavigate } from "react-router";
import {
  useCat,
  useData,
  useMenu,
  useProfile,
  useSearch,
} from "../components/MenuProvider";
import { useNotification, useWidth } from "../components/ContextProvider";
import { categories, severity, wholepath } from "../lib/common";
import MetahkgLogo from "../components/icon";
declare const hcaptcha: { reset: (e: string) => void }; //the hcaptcha object, defined to use hcaptcha.reload("")
/*
 * A select list to choose category
 * props.errorHandler: executed if categories cannot to fetched
 * props.changehandler: used as a callback after user changes category selection
 */
function ChooseCat(props: {
  cat: number;
  setCat: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { cat, setCat } = props;
  const changeHandler = (e: SelectChangeEvent<number>) => {
    setCat(Number(e.target.value));
  };
  return (
    <div>
      {Object.keys(categories).length && (
        <FormControl className="create-choosecat-form">
          <InputLabel color="secondary">Category</InputLabel>
          <Select
            color="secondary"
            value={cat}
            label="Category"
            onChange={changeHandler}
          >
            {Object.entries(categories).map((d: [string, any]) => (
              <MenuItem value={Number(d[0])}>{d[1]}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </div>
  );
}
/*
 * Create component for /create
 * renders a tinymce editor (for content) and a textfield (for title)
 * A captcha must be completed before a user can create a thread
 * The user must be signed in, otherwise he would be redirected to /signin
 */
export default function Create() {
  const navigate = useNavigate();
  const [menu, setMenu] = useMenu();
  const [width] = useWidth();
  const [profile, setProfile] = useProfile();
  const [cat, setCat] = useCat();
  const [search, setSearch] = useSearch();
  const [data, setData] = useData();
  const [, setNotification] = useNotification();
  const [catchoosed, setCatchoosed] = useState<number>(cat || 0);
  const [htoken, setHtoken] = useState(""); //hcaptcha token
  const [title, setTitle] = useState(""); //this will be the post title
  const [icomment, setIcomment] = useState(""); //initial comment (#1)
  const [disabled, setDisabled] = useState(false);
  const [alert, setAlert] = useState<{ severity: severity; text: string }>({
    severity: "info",
    text: "",
  });
  function create() {
    //send data to /api/create
    setAlert({ severity: "info", text: "Creating topic..." });
    setDisabled(true);
    axios
      .post("/api/create", {
        title: title,
        category: catchoosed,
        icomment: icomment,
        htoken: htoken,
      })
      .then((res) => {
        cat && setCat(0);
        search && setSearch(false);
        profile && setProfile(0);
        data.length && setData([]);
        navigate(`/thread/${res.data.id}`);
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
        hcaptcha.reset("");
      });
  }
  document.title = "Create topic | Metahkg";
  menu && setMenu(false);
  if (!localStorage.user) {
    return (
      <Navigate
        to={`/signin?continue=true&returnto=${encodeURIComponent(wholepath())}`}
        replace
      />
    );
  }
  const small = width * 0.8 - 40 <= 450;
  return (
    <Box
      className="flex fullwidth min-height-fullvh justify-center"
      sx={{
        backgroundColor: "primary.dark",
      }}
    >
      <div style={{ width: small ? "100vw" : "80vw" }}>
        <div className="m20">
          <div className="flex align-center">
            <MetahkgLogo
              svg
              height={50}
              width={40}
              light
              className="mr10 mb10"
            />
            <h1>Create topic</h1>
          </div>
          {alert.text && (
            <Alert className="mt10 mb15" severity={alert.severity}>
              {alert.text}
            </Alert>
          )}
          <TextField
            className="mb20"
            variant="outlined"
            color="secondary"
            fullWidth
            label="Title"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <TextEditor
            changehandler={(v, e: any) => {
              setIcomment(e.getContent());
            }}
            text=""
          />
          <div className="mt20">
            <ChooseCat cat={catchoosed} setCat={setCatchoosed} />
          </div>
          <div
            className={`mt20 ${
              small ? "" : "flex fullwidth justify-space-between"
            }`}
          >
            <HCaptcha
              theme="dark"
              sitekey={
                process.env.REACT_APP_hcaptchasitekey ||
                "adbdce6c-dde2-46e1-b881-356447110fa7"
              }
              onVerify={(token) => {
                setHtoken(token);
              }}
            />
            <Button
              disabled={
                disabled || !(icomment && title && htoken && catchoosed)
              }
              className="mt20 create-btn"
              onClick={create}
              variant="contained"
              color="secondary"
            >
              Create
            </Button>
          </div>
        </div>
      </div>
    </Box>
  );
}
