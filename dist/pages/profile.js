import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import "./css/profile.css";
import { Box, Button, LinearProgress, Tooltip } from "@mui/material";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useCat, useData, useId, useMenu, useProfile, useRecall, useSearch, useSelected, useMenuTitle, } from "../components/MenuProvider";
import UploadAvatar from "../components/profile/uploadavatar";
import { setTitle } from "../lib/common";
import { Link } from "react-router-dom";
import { useBack, useNotification, useUser, useIsSmallScreen, } from "../components/ContextProvider";
import { api } from "../lib/api";
import DataTable from "../components/profile/DataTable";
import isInteger from "is-sn-integer";
import { parseError } from "../lib/parseError";
/**
 * This function renders the profile page
 */
export default function Profile() {
    const params = useParams();
    const [profile, setProfile] = useProfile();
    const [search, setSearch] = useSearch();
    const [recall, setRecall] = useRecall();
    const [requestedUser, setRequestedUser] = useState(null);
    const [menu, setMenu] = useMenu();
    const isSmallScreen = useIsSmallScreen();
    const [, setData] = useData();
    const [, setMenuTitle] = useMenuTitle();
    const [id, setId] = useId();
    const [cat, setCat] = useCat();
    const [selected, setSelected] = useSelected();
    const [back, setBack] = useBack();
    const [, setNotification] = useNotification();
    const [user] = useUser();
    const avatarRef = useRef(null);
    const navigate = useNavigate();
    const userId = Number(params.id);
    const isSelf = userId === (user === null || user === void 0 ? void 0 : user.id);
    useEffect(() => {
        if (isInteger(userId) && (!requestedUser || requestedUser.id !== userId)) {
            api.profile
                .userProfile({ userId })
                .then((res) => {
                setRequestedUser(res.data);
                setTitle(`${res.data.name} | Metahkg`);
            })
                .catch((err) => {
                var _a, _b;
                setNotification({ open: true, text: parseError(err) });
                ((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.status) === 404 && navigate("/404", { replace: true });
                ((_b = err === null || err === void 0 ? void 0 : err.response) === null || _b === void 0 ? void 0 : _b.status) === 403 && navigate("/403", { replace: true });
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id, requestedUser]);
    if (!userId)
        return _jsx(Navigate, { to: "/", replace: true });
    (function onRender() {
        /**
         * Clear the data and reset the title and selected index.
         */
        function clearData() {
            setData([]);
            setMenuTitle("");
            selected && setSelected(0);
        }
        back !== window.location.pathname && setBack(window.location.pathname);
        !menu && !isSmallScreen && setMenu(true);
        menu && isSmallScreen && setMenu(false);
        if (profile !== userId) {
            setProfile(userId);
            clearData();
        }
        if (search) {
            setSearch(false);
            clearData();
        }
        recall && setRecall(false);
        id && setId(0);
        cat && setCat(0);
    })();
    return (_jsx(Box, Object.assign({ className: "max-height-fullvh height-fullvh overflow-auto", sx: {
            backgroundColor: "primary.dark",
        } }, { children: !requestedUser ? (_jsx(LinearProgress, { className: "fullwidth", color: "secondary" })) : (_jsxs(Box, Object.assign({ className: "flex justify-center align-center flex-dir-column" }, { children: [_jsxs(Box, Object.assign({ className: "flex justify-center align-center max-width-full mt20", sx: {
                        width: isSmallScreen ? "100vw" : "70vw",
                    } }, { children: [_jsx("img", { src: `/api/profile/avatars/${requestedUser.id}`, alt: "User avatar", height: isSmallScreen ? 150 : 200, width: isSmallScreen ? 150 : 200, ref: avatarRef }), _jsx("br", {}), _jsxs("div", Object.assign({ className: "ml20 flex justify-center profile-toptextdiv", style: {
                                flexDirection: isSelf ? "column" : "row",
                            } }, { children: [_jsxs("h1", Object.assign({ className: "font-size-30 profile-toptext" }, { children: [_jsx("div", Object.assign({ className: "overflow-hidden", style: {
                                                maxWidth: isSmallScreen
                                                    ? "calc(100vw - 250px)"
                                                    : "calc(70vw - 350px)",
                                            } }, { children: _jsx("span", Object.assign({ className: "overflow-hidden text-overflow-ellipsis nowrap", style: {
                                                    color: requestedUser.sex === "M"
                                                        ? "#34aadc"
                                                        : "red",
                                                } }, { children: requestedUser.name })) })), "#", requestedUser.id] })), _jsx("div", Object.assign({ className: "profile-uploaddiv", style: {
                                        marginTop: isSelf ? 25 : 0,
                                    } }, { children: isSelf && (_jsx(Tooltip, Object.assign({ title: "jpg / png / svg supported", arrow: true }, { children: _jsx(UploadAvatar, { onUpload: () => {
                                                setNotification({
                                                    open: true,
                                                    text: "Uploading...",
                                                });
                                            }, onSuccess: () => {
                                                if (avatarRef.current)
                                                    avatarRef.current.src = `/api/profile/avatars/${requestedUser.id}?rand=${Math.random()}`;
                                            }, onError: (err) => {
                                                setNotification({
                                                    open: true,
                                                    text: parseError(err),
                                                });
                                            } }) }))) }))] }))] })), _jsx(Box, Object.assign({ className: "flex mt20 mb10 fullwidth font justify-center" }, { children: _jsx(DataTable, { isSelf: isSelf, setUser: setRequestedUser, requestedUser: requestedUser }, requestedUser.id) })), isSmallScreen && (_jsx("div", Object.assign({ className: "mt20" }, { children: _jsx(Link, Object.assign({ className: "text-decoration-none", to: `/history/${userId}` }, { children: _jsx(Button, Object.assign({ className: "font-size-16", variant: "text", color: "secondary" }, { children: "View History" })) })) })))] }))) })));
}
//# sourceMappingURL=profile.js.map