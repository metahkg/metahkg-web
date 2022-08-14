import React, { useEffect, useLayoutEffect } from "react";
import { setDescription, setTitle } from "./lib/common";
import { Navigate, Outlet, Route, Routes as Switch, useLocation } from "react-router-dom";
import loadable from "@loadable/component";
import EnableMenu from "./lib/utils/enableMenu";
import DisableMenu from "./lib/utils/disableMenu";
import { useId } from "./components/MenuProvider";

const Thread = loadable(() => import("./pages/thread"));

// menu
const Category = loadable(() => import("./pages/category"));
const Search = loadable(() => import("./pages/search"));
const Profile = loadable(() => import("./pages/profile"));
const History = loadable(() => import("./pages/history"));
const Recall = loadable(() => import("./pages/recall"));
const Starred = loadable(() => import("./pages/starred"));

// threads
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
    const [id, setId] = useId();
    const prev = React.useRef(location.pathname);

    useLayoutEffect(() => {
        if (!location.pathname.match(/^\/thread\/[1-9]\d*$/)) id && setId(0);
    }, [id, location.pathname, setId]);

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
            <Route
                path="/category/:category"
                element={
                    <EnableMenu>
                        <Category />
                    </EnableMenu>
                }
            />
            <Route
                path="/thread/:id"
                element={
                    <EnableMenu notOnSmallScreen>
                        <Thread />
                    </EnableMenu>
                }
            />
            <Route
                path="/search"
                element={
                    <EnableMenu>
                        <Search />
                    </EnableMenu>
                }
            />
            <Route
                path="/recall"
                element={
                    <EnableMenu>
                        <Recall />
                    </EnableMenu>
                }
            />
            <Route
                path="/starred"
                element={
                    <EnableMenu>
                        <Starred />
                    </EnableMenu>
                }
            />
            <Route
                path="/profile/:id"
                element={
                    <EnableMenu notOnSmallScreen>
                        <Profile />
                    </EnableMenu>
                }
            />
            <Route
                path="/history/:id"
                element={
                    <EnableMenu>
                        <History />
                    </EnableMenu>
                }
            />
            <Route
                path="/create"
                element={
                    <DisableMenu>
                        <Create />
                    </DisableMenu>
                }
            />
            <Route
                path="/users"
                element={
                    <DisableMenu>
                        <Outlet />
                    </DisableMenu>
                }
            >
                <Route path="" element={<Navigate to="/users/login" replace />} />
                <Route path="register" element={<Register />} />
                <Route path="verify" element={<Verify />} />
                <Route path="resend" element={<Resend />} />
                <Route path="login" element={<Login />} />
                <Route path="logout" element={<Logout />} />
            </Route>
            <Route
                path="/404"
                element={
                    <DisableMenu>
                        <NotFound />
                    </DisableMenu>
                }
            />
            <Route
                path="/403"
                element={
                    <DisableMenu>
                        <Forbidden />
                    </DisableMenu>
                }
            />
            <Route path="*" element={<Navigate to="/404" replace />} />
        </Switch>
    );
}
