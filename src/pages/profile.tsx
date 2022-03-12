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
  useRecall,
} from "../components/MenuProvider";
import UploadAvatar from "../components/uploadavatar";
import { timetoword_long } from "../lib/common";
import { Link } from "react-router-dom";
import {
  useHistory,
  useNotification,
  useWidth,
} from "../components/ContextProvider";
/* It's a function that returns a table with the user's information. */
function DataTable(props: {
  user: {
    user: string;
    count: number;
    sex: "M" | "F";
    admin?: boolean;
    createdAt: string;
  };
}) {
  const [width] = useWidth();
  const tablerows = ["Name", "Posts", "Sex", "Admin", "Joined"];
  const items = [
    props.user.user,
    props.user.count,
    props.user.sex === "M" ? "male" : "female",
    props.user?.admin ? "yes" : "no",
    `${timetoword_long(props.user.createdAt)} ago`,
  ];
  return (
    <TableContainer
      sx={{ maxWidth: width < 760 ? "100%" : "70%" }}
      className="ml50 mr50"
      component={Paper}
    >
      <Table className="fullwidth" aria-label="simple table">
        <TableBody>
          {items.map((item, index) => (
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                className="font-size-16-force"
              >
                {tablerows[index]}
              </TableCell>
              <TableCell
                component="th"
                scope="row"
                className="font-size-16-force"
              >
                {item}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
/**
 * This function renders the profile page
 */
/* It's a function that renders the profile page. */
export default function Profile() {
  const params = useParams();
  const [profile, setProfile] = useProfile();
  const [search, setSearch] = useSearch();
  const [recall, setRecall] = useRecall();
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
  /* It's a way to make sure that the component is re-rendered when the user changes the profile. */
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
  /**
   * Clear the data and reset the title and selected index.
   */
  function cleardata() {
    setData([]);
    setTitle("");
    selected && setSelected(0);
  }
  if (params?.id === "self" && !localStorage.user)
    return <Navigate to="/" replace />;
  history !== window.location.pathname && setHistory(window.location.pathname);
  !menu && !(width < 760) && setMenu(true);
  menu && width < 760 && setMenu(false);
  (profile !== (Number(params.id) || "self") || search) && cleardata();
  profile !== (Number(params.id) || "self") &&
    setProfile(Number(params.id) || "self");
  search && setSearch(false);
  recall && setRecall(false);
  id && setId(0);
  cat && setCat(0);
  return (
    <Box
      className="flex min-height-fullvh profile-root"
      sx={{
        backgroundColor: "primary.dark",
      }}
    >
      {!Object.keys(user).length ? (
        <LinearProgress className="fullwidth" color="secondary" />
      ) : (
        user?.[0] !== null && (
          <Paper className="nobgimage max-height-fullvh overflow-auto">
            <Box className="flex min-height-fullvh justify-center align-center flex-dir-column">
              <Box
                className="flex justify-center align-center max-width-full mt10"
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
                  className="ml20 flex justify-center profile-toptextdiv"
                  style={{
                    flexDirection: params.id === "self" ? "column" : "row",
                  }}
                >
                  <h1 className="font-size-30 profile-toptext">
                    <div
                      className="overflow-hidden"
                      style={{
                        maxWidth:
                          width < 760
                            ? "calc(100vw - 250px)"
                            : "calc(70vw - 350px)",
                      }}
                    >
                      <span
                        className="overflow-hidden text-overflow-ellipsis"
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
                    {params.id === "self" && (
                      <UploadAvatar
                        onUpload={() => {
                          setNotification({ open: true, text: "Uploading..." });
                        }}
                        onSuccess={() => {
                          window.location.reload();
                        }}
                        onError={(err) => {
                          setNotification({
                            open: true,
                            text: `Upload failed: ${err.response.data}`,
                          });
                        }}
                      />
                    )}
                  </div>
                </div>
              </Box>
              <Box className="flex mt20 mb10 fullwidth font justify-center">
                <DataTable user={user} />
              </Box>
              {width < 760 && (
                <div className="mt20">
                  <Link
                    className="notextdecoration"
                    to={`/history/${params.id}`}
                  >
                    <Button
                      className="font-size-16"
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
