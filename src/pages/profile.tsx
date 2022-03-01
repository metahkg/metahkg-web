import React, { useEffect } from "react";
import "./css/profile.css";
import {
  Box,
  Button,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import {
  useData,
  useId,
  useMenu,
  useProfile,
  useSearch,
  useSelected,
  useTitle,
  useCat,
} from "../components/MenuProvider";
import UploadAvatar from "../components/uploadavatar";
import { timetoword_long } from "../lib/common";
import { Link } from "react-router-dom";
import {
  useHistory,
  useNotification,
  useWidth,
} from "../components/ContextProvider";
/*
 * ProfileMenu returns posts that a user has posted
 * Renders a Menu without any threads if the user has posted nothing
 * Used in /profile/:id (if width >= 750) and /history/:id (id width < 750)
 */
function DataTable(props: { user: any }) {
  const tablerows = ["Name", "Posts", "Sex", "Admin", "Joined"];
  const items = [
    props.user.user,
    props.user.count,
    props.user.sex === "M" ? "male" : "female",
    props.user?.admin ? "yes" : "no",
    `${timetoword_long(props.user.createdAt)} ago`,
  ];
  return (
    <TableContainer className="profile-tablecontainer" component={Paper}>
      <Table className="fullwidth" aria-label="simple table">
        <TableBody>
          {items.map((item, index) => (
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx={{ fontSize: "16px" }}>
                {tablerows[index]}
              </TableCell>
              <TableCell component="th" scope="row" sx={{ fontSize: "16px" }}>
                {item}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default function Profile() {
  const params = useParams();
  const [profile, setProfile] = useProfile();
  const [search, setSearch] = useSearch();
  const [user, setUser] = useState<any>({});
  const [menu, setMenu] = useMenu();
  const [width] = useWidth();
  const [, setData] = useData();
  const [, setTitle] = useTitle();
  const [id, setId] = useId();
  const [cat, setCat] = useCat();
  const [selected, setSelected] = useSelected();
  const [history, setHistory] = useHistory();
  const [, setNotification] = useNotification();
  const navigate = useNavigate();
  useEffect(() => {
    if (!(params.id === "self" && !localStorage.user)) {
      axios
        .get(`/api/profile/${Number(params.id) || "self"}`)
        .then((res) => {
          setUser(res.data);
          document.title = `${res.data.user} | Metahkg`;
        })
        .catch((err: AxiosError) => {
          setNotification({ open: true, text: err?.response?.data?.error });
          err?.response?.status === 404 && navigate("/404", { replace: true });
        });
    }
  }, [navigate, params.id, setNotification]);
  function cleardata() {
    setData([]);
    setTitle("");
    selected && setSelected(0);
  }
  if (params?.id === "self" && !localStorage.user) {
    return <Navigate to="/" replace />;
  }
  history !== window.location.pathname && setHistory(window.location.pathname);
  !menu && !(width < 760) && setMenu(true);
  menu && width < 760 && setMenu(false);
  if (profile !== (Number(params.id) || "self")) {
    setProfile(Number(params.id) || "self");
    cleardata();
  }
  if (search) {
    setSearch(false);
    cleardata();
  }
  id && setId(0);
  cat && setCat(0);
  return (
    <Box
      className="profile-root flex"
      sx={{
        backgroundColor: "primary.dark",
      }}
    >
      {!Object.keys(user).length ? (
        <LinearProgress className="fullwidth" color="secondary" />
      ) : (
        user?.[0] !== null && (
          <Paper className="profile-paper">
            <Box className="profile-mainbox flex">
              <Box
                className="profile-top flex"
                sx={{
                  width: width < 760 ? "100vw" : "70vw",
                }}
              >
                <img
                  src={
                    user?.avatar ||
                    "https://metahkg.s3.amazonaws.com/avatars/noavatar.png"
                  }
                  alt="User avatar"
                  height={width < 760 ? 150 : 200}
                  width={width < 760 ? 150 : 200}
                />
                <br />
                <div
                  className="profile-toptextdiv ml20 flex"
                  style={{
                    flexDirection: params.id === "self" ? "column" : "row",
                  }}
                >
                  <h1 className="profile-toptext">
                    <div
                      className="profile-userspandiv"
                      style={{
                        maxWidth:
                          width < 760
                            ? "calc(100vw - 250px)"
                            : "calc(70vw - 350px)",
                      }}
                    >
                      <span
                        className="profile-userspan"
                        style={{
                          color: user.sex === "M" ? "#34aadc" : "red",
                        }}
                      >
                        {user.user}
                      </span>
                    </div>
                    #{user.id}
                  </h1>
                  <div
                    className="profile-uploaddiv"
                    style={{
                      marginTop: params.id === "self" ? 25 : 0,
                    }}
                  >
                    {params.id === "self" && <UploadAvatar />}
                  </div>
                </div>
              </Box>
              <Box className="profile-tablebox flex mt20 mb10 fullwidth font">
                <DataTable user={user} />
              </Box>
              {width < 760 && (
                <div className="mt20">
                  <Link
                    className="notextdecoration"
                    to={`/history/${params.id}`}
                  >
                    <Button
                      className="profile-historybtn"
                      variant="text"
                      color="secondary"
                    >
                      View History
                    </Button>
                  </Link>
                </div>
              )}
            </Box>
          </Paper>
        )
      )}
    </Box>
  );
}
