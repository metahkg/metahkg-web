import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
// threads
const AddComment = loadable(() => import("./pages/AddComment"));
const Create = loadable(() => import("./pages/create"));
// users
const Verify = loadable(() => import("./pages/users/verify"));
const Resend = loadable(() => import("./pages/users/resend"));
const Register = loadable(() => import("./pages/users/register"));
const Login = loadable(() => import("./pages/users/login"));
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
    return (_jsxs(Switch, { children: [_jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/category/1", replace: true }) }), _jsx(Route, { path: "/thread/:id", element: _jsx(Thread, {}) }), _jsx(Route, { path: "/comment/:id", element: _jsx(AddComment, {}) }), _jsx(Route, { path: "/category/:category", element: _jsx(Category, {}) }), _jsx(Route, { path: "/users/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/users/verify", element: _jsx(Verify, {}) }), _jsx(Route, { path: "/users/resend", element: _jsx(Resend, {}) }), _jsx(Route, { path: "/users/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/users/logout", element: _jsx(Logout, {}) }), _jsx(Route, { path: "/create", element: _jsx(Create, {}) }), _jsx(Route, { path: "/search", element: _jsx(Search, {}) }), _jsx(Route, { path: "/profile/:id", element: _jsx(Profile, {}) }), _jsx(Route, { path: "/history/:id", element: _jsx(History, {}) }), _jsx(Route, { path: "/recall", element: _jsx(Recall, {}) }), _jsx(Route, { path: "/404", element: _jsx(NotFound, {}) }), _jsx(Route, { path: "/403", element: _jsx(Forbidden, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/404", replace: true }) })] }));
}
//# sourceMappingURL=Routes.js.map