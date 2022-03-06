import "./css/create.css";
import React, { useEffect, useState } from "react";
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
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import { Navigate, useNavigate } from "react-router";
import queryString from "query-string";
import {
  useCat,
  useData,
  useMenu,
  useProfile,
  useSearch,
} from "../components/MenuProvider";
import { useNotification, useWidth } from "../components/ContextProvider";
import { categories, severity, wholepath } from "../lib/common";
import MetahkgLogo from "../components/logo";
/* A workaround for the recaptcha.reset() function not being exported from the recaptcha library. */
declare const recaptcha: { reset: (e: string) => void };
/**
 * It takes in a category number and a setter function for the category number, and returns a form
 * control with a select menu that allows the user to choose a category
 * @param {number} props.cat The currently choosed category
 * @param {React.Dispatch<React.SetStateAction<number>>} props.setCat The function to update props.cat
 * @returns A form control with a select menu.
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
/**
 * Page for creating a new topic
 */
export default function Create() {
  const navigate = useNavigate();
  const query = queryString.parse(window.location.search);
  const [menu, setMenu] = useMenu();
  const [width] = useWidth();
  const [profile, setProfile] = useProfile();
  const [cat, setCat] = useCat();
  const [search, setSearch] = useSearch();
  const [data, setData] = useData();
  const [, setNotification] = useNotification();
  const [catchoosed, setCatchoosed] = useState<number>(cat || 0);
  const [rtoken, setRtoken] = useState(""); //recaptcha token
  const [title, setTitle] = useState(""); //this will be the post title
  const [icomment, setIcomment] = useState(""); //initial comment (#1)
  const [disabled, setDisabled] = useState(false);
  const [alert, setAlert] = useState<{ severity: severity; text: string }>({
    severity: "info",
    text: "",
  });
  const quote = {
    id: Number(String(query.quote).split(".")[0]),
    cid: Number(String(query.quote).split(".")[1]),
  };
  const [inittext, setInittext] = useState("");
  /**
   * It sends data to the /api/create route.
   */
  useEffect(() => {
    if (localStorage.user && quote.id && quote.cid) {
      setNotification({ open: true, text: "Fetching comment..." });
      axios
        .get(
          `/api/thread/${quote.id}?type=2&start=${quote.cid}&end=${quote.cid}`
        )
        .then((res) => {
          setInittext(
            `<blockquote style="color: #aca9a9; border-left: 2px solid #aca9a9; margin-left: 0"><div style="margin-left: 15px">${res.data?.[0]?.comment}</div></blockquote><p></p>`
          );
          setTimeout(() => {
            setNotification({ open: false, text: "" });
          }, 1000);
        })
        .catch(() => {
          setNotification({
            open: true,
            text: "Unable to fetch comment. This comment would not be a quote.",
          });
        });
    }
  }, [quote.cid, quote.id, setNotification]);
  function create() {
    //send data to /api/create
    setAlert({ severity: "info", text: "Creating topic..." });
    setDisabled(true);
    axios
      .post("/api/create", {
        title: title,
        category: catchoosed,
        icomment: icomment,
        rtoken: rtoken,
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
        recaptcha.reset("");
      });
  }
  document.title = "Create topic | Metahkg";
  menu && setMenu(false);
  if (!localStorage.user)
    return (
      <Navigate
        to={`/signin?continue=true&returnto=${encodeURIComponent(wholepath())}`}
        replace
      />
    );
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
            text={inittext}
          />
          <div className="mt20">
            <ChooseCat cat={catchoosed} setCat={setCatchoosed} />
          </div>
          <div
            className={`mt20 ${
              small ? "" : "flex fullwidth justify-space-between"
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
              disabled={
                disabled || !(icomment && title && rtoken && catchoosed)
              }
              className="mt20 font-size-16 create-btn"
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
