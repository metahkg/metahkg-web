import React from "react";
import { Alert, Box } from "@mui/material";
import axios from "axios";
import { useMenu } from "../components/MenuProvider";
import queryString from "query-string";
import { useNavigate } from "react-router";
import { useNotification } from "../components/ContextProvider";
async function logout() {
  await axios.get("/api/logout");
  localStorage.clear();
}
/*
 * Logs a user out by clearing localStorage and
 * sending a GET request to /api/logout, the server
 * would then remove user's cookie "key"
 */
export default function Logout() {
  const [menu, setMenu] = useMenu();
  const [, setNotification] = useNotification();
  const navigate = useNavigate();
  const query = queryString.parse(window.location.search);
  menu && setMenu(false);
  logout().then(() => {
    navigate(decodeURIComponent(String(query.returnto || "/")), {replace: true});
    setNotification({open: true, text: "Logged out."});
  });
  return (
    <Box
      sx={{
        backgroundColor: "primary.dark",
        minHeight: "100vh",
        justifyContent: "center",
        width: "100vw",
      }}
    >
      <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
        <Alert sx={{ marginTop: "30px", width: "50%" }} severity="info">
          Logging you out...
        </Alert>
      </div>
    </Box>
  );
}
