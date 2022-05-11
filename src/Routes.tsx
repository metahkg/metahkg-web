import React, { useEffect } from "react";
import { setDescription, setTitle } from "./lib/common";
import { Navigate, Route, Routes as Switch, useLocation } from "react-router-dom";
import loadable from "@loadable/component";

const Thread = loadable(() => import("./pages/thread"));

// menu
const Category = loadable(() => import("./pages/category"));
const Search = loadable(() => import("./pages/search"));
const Profile = loadable(() => import("./pages/profile"));
const History = loadable(() => import("./pages/history"));
const Recall = loadable(() => import("./pages/recall"));

// posts
const AddComment = loadable(() => import("./pages/AddComment"));
const Create = loadable(() => import("./pages/create"));

// users
const Verify = loadable(() => import("./pages/users/verify"));
const Resend = loadable(() => import("./pages/users/resend"));
const Register = loadable(() => import("./pages/users/signup"));
const Signin = loadable(() => import("./pages/users/signin"));
const Logout = loadable(() => import("./pages/users/logout"));

// errors
const NotFound = loadable(() => import("./pages/notfound"));
const Forbidden = loadable(() => import("./pages/forbidden"));

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
