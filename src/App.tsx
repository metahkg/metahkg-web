import React, { useEffect } from "react";
import "./css/App.css";
import "./css/common.css";
import "./css/fontsize.css";
import "./css/margin.css";
import Theme from "./lib/theme";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./pages/signup";
import Signin from "./pages/signin";
import Thread from "./pages/thread";
import AddComment from "./pages/AddComment";
import Create from "./pages/create";
import Category from "./pages/category";
import Logout from "./pages/logout";
import Search from "./pages/search";
import Profile from "./pages/profile";
import History from "./pages/history";
import Menu from "./components/menu";
import { useMenu } from "./components/MenuProvider";
import { Box } from "@mui/material";
import { useWidth } from "./components/ContextProvider";
import { Notification } from "./lib/notification";
import NotFound from "./pages/notfound";
import axios from "axios";
function Source() {
  window.location.replace("https://gitlab.com/metahkg/metahkg");
  return <div />;
}
function Telegram() {
  window.location.replace("https://t.me/+WbB7PyRovUY1ZDFl");
  return <div />;
}
/**
 * Menu is not in the Routes to prevent unnecessary rerenders
 * Instead it is controlled by components inside Routes
 */
export default function App() {
  const [menu] = useMenu();
  const [width] = useWidth();
  useEffect(() => {
    if (localStorage.user || localStorage.id) {
      axios.get("/api/loggedin").then((res) => {
        if (!res.data.loggedin) {
          localStorage.clear();
          return;
        }
        localStorage.user !== res.data.user &&
          localStorage.setItem("user", res.data.user);
        localStorage.id !== Number(res.data.id) &&
          localStorage.setItem("id", res.data.id);
      });
    }
  }, []);
  return (
    <Theme
      primary={{ main: "#222222" }}
      secondary={{ main: "#f5bd1f", dark: "#ffc100" }}
    >
      <Notification />
      <Box className="max-height-fullvh" sx={{ bgcolor: "primary.dark" }}>
        <Router>
          <div className="flex">
            <div key={Number(menu)}>
              {menu && (
                <div style={{ width: width < 760 ? "100vw" : "30vw" }}>
                  <Menu />
                </div>
              )}
            </div>
            <Routes>
              <Route path="/" element={<Navigate to="/category/1" replace />} />
              <Route path="/thread/:id" element={<Thread />} />
              <Route path="/comment/:id" element={<AddComment />} />
              <Route path="/category/:category" element={<Category />} />
              <Route path="/register" element={<Register />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/create" element={<Create />} />
              <Route path="/search" element={<Search />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/source" element={<Source />} />
              <Route path="/telegram" element={<Telegram />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/history/:id" element={<History />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </div>
        </Router>
      </Box>
    </Theme>
  );
}
