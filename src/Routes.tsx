/*
 Copyright (C) 2022-present Metahkg Contributors

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React, { useEffect, useLayoutEffect } from "react";
import { setDescription, setTitle } from "./lib/common";
import { Navigate, Outlet, Route, Routes as Switch, useLocation } from "react-router-dom";
import loadable from "@loadable/component";
import EnableMenu from "./lib/utils/enableMenu";
import DisableMenu from "./lib/utils/disableMenu";
import { useId } from "./components/MenuProvider";
import { useServerConfig, useUser } from "./components/AppContextProvider";

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
const Forgot = loadable(() => import("./pages/users/forgot"));
const Reset = loadable(() => import("./pages/users/reset"));
const Register = loadable(() => import("./pages/users/register"));
const Login = loadable(() => import("./pages/users/login"));

// errors
const NotFound = loadable(() => import("./pages/notfound"));
const Forbidden = loadable(() => import("./pages/forbidden"));

export default function Routes() {
    const location = useLocation();
    const [id, setId] = useId();
    const [serverConfig] = useServerConfig();
    const [user] = useUser();
    const prev = React.useRef(location.pathname);

    const noAccess = serverConfig?.visibility === "internal" && !user;

    useLayoutEffect(() => {
        if (!/^\/thread\/[1-9]\d*$/.test(location.pathname)) id && setId(0);
    }, [id, location.pathname, setId]);

    useEffect(() => {
        if (location.pathname !== prev.current) {
            setTitle(serverConfig?.branding || "Metahkg");
            setDescription(
                `${
                    serverConfig?.branding || "Metahkg"
                } is a free and open source lihkg-style forum.`,
            );
            prev.current = location.pathname;
        }
    }, [serverConfig, location]);

    return (
        <Switch>
            <Route
                path="/"
                element={
                    <Navigate
                        to={noAccess ? "/users/login?continue=true" : "/category/1"}
                        replace
                    />
                }
            />
            <Route
                path="/category/:category"
                element={
                    noAccess ? (
                        <Navigate to="/users/login?continue=true" replace />
                    ) : (
                        <EnableMenu>
                            <Category />
                        </EnableMenu>
                    )
                }
            />
            <Route
                path="/thread/:id"
                element={
                    noAccess ? (
                        <Navigate to="/users/login?continue=true" replace />
                    ) : (
                        <EnableMenu notOnSmallScreen>
                            <Thread />
                        </EnableMenu>
                    )
                }
            />
            <Route
                path="/search"
                element={
                    noAccess ? (
                        <Navigate to="/users/login?continue=true" replace />
                    ) : (
                        <EnableMenu>
                            <Search />
                        </EnableMenu>
                    )
                }
            />
            <Route
                path="/recall"
                element={
                    noAccess ? (
                        <Navigate to="/users/login?continue=true" replace />
                    ) : (
                        <EnableMenu>
                            <Recall />
                        </EnableMenu>
                    )
                }
            />
            <Route
                path="/starred"
                element={
                    noAccess ? (
                        <Navigate to="/users/login?continue=true" replace />
                    ) : (
                        <EnableMenu>
                            <Starred />
                        </EnableMenu>
                    )
                }
            />
            <Route
                path="/profile/:id"
                element={
                    noAccess ? (
                        <Navigate to="/users/login?continue=true" replace />
                    ) : (
                        <EnableMenu notOnSmallScreen>
                            <Profile />
                        </EnableMenu>
                    )
                }
            />
            <Route
                path="/history/:id"
                element={
                    noAccess ? (
                        <Navigate to="/users/login?continue=true" replace />
                    ) : (
                        <EnableMenu>
                            <History />
                        </EnableMenu>
                    )
                }
            />
            <Route
                path="/create"
                element={
                    noAccess ? (
                        <Navigate to="/users/login?continue=true" replace />
                    ) : (
                        <DisableMenu>
                            <Create />
                        </DisableMenu>
                    )
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
                <Route path="forgot" element={<Forgot />} />
                <Route path="reset" element={<Reset />} />
                <Route path="login" element={<Login />} />
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
