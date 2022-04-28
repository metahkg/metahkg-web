import React, { useEffect } from "react";
import { setDescription, setTitle } from "./lib/common";
import { Navigate, Route, Routes as Switch, useLocation } from "react-router-dom";
import Register from "./pages/users/signup";
import Signin from "./pages/users/signin";
import Thread from "./pages/thread";
import AddComment from "./pages/AddComment";
import Create from "./pages/create";
import Category from "./pages/category";
import Logout from "./pages/users/logout";
import Search from "./pages/search";
import Profile from "./pages/profile";
import History from "./pages/history";
import NotFound from "./pages/notfound";
import Verify from "./pages/users/verify";
import Resend from "./pages/users/resend";
import Recall from "./pages/recall";
import Forbidden from "./pages/forbidden";
export default function Routes() {
    const location = useLocation();
    const prev = React.useRef(location.pathname);

    useEffect(() => {
        if (location.pathname !== prev.current) {
            setTitle("Metahkg");
            setDescription("Metahkg is a free and open source lihkg-style forum.");
            prev.current = location.pathname;
        }
    }, [location]);

    return (
        <Switch>
            <Route path="/" element={<Navigate to="/category/1" replace />} />
            <Route path="/thread/:id" element={<Thread />} />
            <Route path="/comment/:id" element={<AddComment />} />
            <Route path="/category/:category" element={<Category />} />
            <Route path="/users/register" element={<Register />} />
            <Route path="/users/verify" element={<Verify />} />
            <Route path="/users/resend" element={<Resend />} />
            <Route path="/users/signin" element={<Signin />} />
            <Route path="/users/logout" element={<Logout />} />
            <Route path="/create" element={<Create />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/history/:id" element={<History />} />
            <Route path="/recall" element={<Recall />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="/401" element={<Forbidden />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
        </Switch>
    );
}
