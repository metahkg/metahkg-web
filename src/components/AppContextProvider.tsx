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

import React, {
    createContext,
    Dispatch,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import type { history } from "../types/history";
import type { notification } from "../types/notification";
import type { Settings } from "../types/settings";
import { api } from "../lib/api";
import { AlertDialogProps } from "../lib/alertDialog";
import { BlockedUser, Category, User, Star, ServerConfig } from "@metahkg/api";
import { Session } from "../types/session";
import { loadUser } from "../lib/jwt";
import { AvatarProps, useAvatar } from "../hooks/useAvatar";
import { UserData } from "./profile/DataTable";

export const AppContext = createContext<{
    back: [string, Dispatch<SetStateAction<string>>];
    query: [string, Dispatch<SetStateAction<string>>];
    width: [number, Dispatch<SetStateAction<number>>];
    isSmallScreen: boolean;
    height: [number, Dispatch<SetStateAction<number>>];
    notification: [notification, Dispatch<SetStateAction<notification>>];
    settingsOpen: [boolean, Dispatch<SetStateAction<boolean>>];
    settings: [Settings, Dispatch<SetStateAction<Settings>>];
    darkMode: boolean;
    history: [history, Dispatch<SetStateAction<history>>];
    categories: [Category[], Dispatch<SetStateAction<Category[]>>];
    serverPublicKey: [string, Dispatch<SetStateAction<string>>];
    serverConfig: [ServerConfig | null, Dispatch<SetStateAction<ServerConfig | null>>];
    user: [User | null, Dispatch<SetStateAction<User | null>>];
    userAvatar: AvatarProps;
    userProfile: [UserData, Dispatch<SetStateAction<UserData | null>>];
    session: [Session | null, Dispatch<SetStateAction<Session | null>>];
    alertDialog: [AlertDialogProps, Dispatch<SetStateAction<AlertDialogProps>>];
    blockList: [BlockedUser[], Dispatch<SetStateAction<BlockedUser[]>>];
    starList: [Star[], Dispatch<SetStateAction<Star[]>>];
    sidePanelExpanded: [boolean, Dispatch<SetStateAction<boolean>>];
    // @ts-ignore
}>(null);

/**
 * Holds global application values.
 * @param props - { children: JSX.Element }
 * @returns The AppContextProvider is returning a JSX element.
 */
export default function AppContextProvider(props: { children: JSX.Element }) {
    const [back, setBack] = useState("");
    const [query, setQuery] = useState(localStorage.query || "");
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);
    const [isSmallScreen, setIsSmallScreen] = useState(width < 768);
    const [notification, setNotification] = useState({ open: false, text: "" });
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [settings, setSettings] = useState<Settings>({
        ...{
            theme: "dark",
            secondaryColor: { main: "#f5bd1f", dark: "#ffc100" },
            filterSwearWords: false,
            autoLoadImages: true,
            resizeImages: true,
            linkPreview: true,
            pdfViewer: false,
            videoPlayer: false,
            notifications: true,
            conversationLimit: 25,
        },
        ...JSON.parse(localStorage.getItem("settings") || "{}"),
    });

    const isDarkMode = useCallback(() => {
        return (
            settings.theme === "dark" ||
            (settings.theme === "system" &&
                window.matchMedia("(prefers-color-scheme: dark)").matches) ||
            !settings.theme
        );
    }, [settings.theme]);

    const [darkMode, setDarkMode] = useState(isDarkMode());
    const [serverPublicKey, setServerPublicKey] = useState<string>(
        localStorage.getItem("serverPublicKey") || "",
    );
    const [serverConfig, setServerConfig] = useState<ServerConfig | null>(
        JSON.parse(localStorage.getItem("serverConfig") || "null") || null,
    );
    const [session, setSession] = useState<Session | null>(
        JSON.parse(localStorage.getItem("session") || "null") || null,
    );
    const [user, setUser] = useState(loadUser(session?.token));
    const userAvatar = useAvatar(user?.id || 0);
    const [userProfile, setUserProfile] = useState(
        JSON.parse(localStorage.getItem("userProfile") || "null") || null,
    );
    const [categories, setCategories] = useState<Category[]>(
        JSON.parse(localStorage.getItem("categories") || "[]"),
    );
    const parsedHistory: { id: number; cid: number; c: number }[] = JSON.parse(
        localStorage.getItem("history") || "[]",
    );
    /** migrate from old */
    if (parsedHistory.length && !parsedHistory[0].id) {
        for (let i = 0; i < parsedHistory.length; i++) {
            parsedHistory.push({ id: Number(parsedHistory.shift()), cid: 1, c: 1 });
        }
        localStorage.setItem("history", JSON.stringify(parsedHistory));
    }
    const [history, setHistory] = useState(parsedHistory);
    const listeningResize = useRef(false);
    const [alertDialog, setAlertDialog] = useState<AlertDialogProps>({
        open: false,
        setOpen: (x) => {
            setAlertDialog({ ...alertDialog, open: x });
        },
        title: "",
        message: "",
        btns: () => [],
    });
    const [blockList, setBlockList] = useState<BlockedUser[]>(
        JSON.parse(localStorage.getItem("blocklist") || "[]"),
    );
    const [starList, setStarList] = useState<Star[]>(
        JSON.parse(localStorage.getItem("starlist") || "[]"),
    );
    const [sidePanelExpanded, setSidePanelExpanded] = useState(
        JSON.parse(
            localStorage.getItem("sidePanelExpanded") ||
                (isSmallScreen ? "true" : "false"),
        ),
    );

    useEffect(() => {
        api.categories().then(setCategories);
    }, [user]);

    useEffect(() => {
        api.serverPublicKey().then(setServerPublicKey);
    }, []);

    useEffect(() => {
        api.serverConfig().then(setServerConfig);
    }, []);

    useEffect(() => {
        if (user) {
            api.meBlocked().then(setBlockList);
            api.meStarred().then(setStarList);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    useEffect(() => {
        if (user) {
            api.userProfile(user.id).then(setUserProfile);
        }
        if (userProfile && !user?.id) {
            setUserProfile(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    const updateListsInterval = useRef<NodeJS.Timer>();

    useEffect(() => {
        if (updateListsInterval.current) {
            clearInterval(updateListsInterval.current);
        }
        if (user) {
            updateListsInterval.current = setInterval(
                () => {
                    api.meBlocked().then(setBlockList);
                    api.meStarred().then(setStarList);
                },
                1000 * 60 * 10,
            );
        }
    }, [user]);

    useEffect(() => {
        localStorage.setItem("history", JSON.stringify(history));
    }, [history]);

    useEffect(() => {
        localStorage.setItem("query", query);
    }, [query]);

    useEffect(() => {
        setIsSmallScreen(width < 768);
    }, [width]);

    useEffect(() => {
        localStorage.setItem("settings", JSON.stringify(settings));
        setDarkMode(isDarkMode());
    }, [isDarkMode, settings]);

    useEffect(() => {
        localStorage.setItem("serverPublicKey", serverPublicKey);
    }, [serverPublicKey]);

    useEffect(() => {
        localStorage.setItem("serverConfig", JSON.stringify(serverConfig));
    }, [serverConfig]);

    useEffect(() => {
        if (!session) {
            localStorage.removeItem("session");
            setUser(null);
        } else {
            localStorage.setItem("session", JSON.stringify(session));
        }
    }, [session]);

    useEffect(() => {
        if (session?.token) {
            setUser(loadUser(session.token));
        }
    }, [session?.token]);

    useEffect(() => {
        localStorage.setItem("userProfile", JSON.stringify(userProfile));
    }, [userProfile]);

    useEffect(() => {
        localStorage.setItem("categories", JSON.stringify(categories));
    }, [categories]);

    useEffect(() => {
        localStorage.setItem("blocklist", JSON.stringify(blockList));
    }, [blockList]);

    useEffect(() => {
        localStorage.setItem("starlist", JSON.stringify(starList));
    }, [starList]);

    useEffect(() => {
        localStorage.setItem("sidePanelExpanded", JSON.stringify(sidePanelExpanded));
    }, [sidePanelExpanded]);

    function updateSize() {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    }

    if (!listeningResize.current) {
        listeningResize.current = true;
        window.addEventListener("resize", updateSize);
    }

    return (
        <AppContext.Provider
            value={{
                back: [back, setBack],
                width: [width, setWidth],
                height: [height, setHeight],
                isSmallScreen,
                query: [query, setQuery],
                notification: [notification, setNotification],
                settingsOpen: [settingsOpen, setSettingsOpen],
                settings: [settings, setSettings],
                darkMode,
                history: [history, setHistory],
                categories: [categories, setCategories],
                serverPublicKey: [serverPublicKey, setServerPublicKey],
                serverConfig: [serverConfig, setServerConfig],
                user: [user, setUser],
                userAvatar,
                userProfile: [userProfile, setUserProfile],
                session: [session, setSession],
                alertDialog: [alertDialog, setAlertDialog],
                blockList: [blockList, setBlockList],
                starList: [starList, setStarList],
                sidePanelExpanded: [sidePanelExpanded, setSidePanelExpanded],
            }}
        >
            {props.children}
        </AppContext.Provider>
    );
}

/**
 * It returns the current history and a setter for the history
 * @returns The history object and a setter function.
 */
export function useBack() {
    const { back } = useContext(AppContext);
    return back;
}

/**
 * "Use the width of the window."
 *
 * The function returns a tuple of two values:
 *
 * The width of the window
 * A setter function for the width of the window
 *
 * The first value is the width of the window. The second value is a setter function for the width of
 * the window
 * @returns The width of the window and a setter for the width of the window.
 */
export function useWidth() {
    const { width } = useContext(AppContext);
    return width;
}

/**
 * It returns a tuple of the last search query and a setter function for the query
 * @returns A tuple of two values. The first value is the query, and the second value is a
 * setter function for the query.
 */
export function useQuery() {
    const { query } = useContext(AppContext);
    return query;
}

/**
 * "Use the height value from the Context."
 *
 * The function returns a tuple of two values:
 *
 * The height value from the Context.
 * A setter function for the height value in the Context
 * @returns The height of the window and a setter for the height of the window.
 */
export function useHeight() {
    const { height } = useContext(AppContext);
    return height;
}

/**
 * It returns a tuple of two values. The first value is an object that represents the state of the
 * notification. The second value is a function that sets the state of the notification
 * @returns A tuple of two values. The first value is the current state of the notification. The second
 * value is a function that can be used to update the state of the notification.
 */
export function useNotification() {
    const { notification } = useContext(AppContext);
    return notification;
}

/**
 * It returns the value of the settingsOpen state and a setter function for that state
 * @returns The boolean value of the settingsOpen state and a function to set the state.
 */
export function useSettingsOpen() {
    const { settingsOpen } = useContext(AppContext);
    return settingsOpen;
}

/**
 * It returns the settings object and a setter function
 * @returns A tuple of the settings object and a setter function.
 */
export function useSettings() {
    const { settings } = useContext(AppContext);
    return settings;
}

export function useDarkMode() {
    const { darkMode } = useContext(AppContext);
    return darkMode;
}

/**
 * It returns the history of the current user
 * @returns The history array and a setter function.
 */
export function useHistory() {
    const { history } = useContext(AppContext);
    return history;
}

export function useCategories() {
    const { categories } = useContext(AppContext);
    return categories;
}

export function useUser() {
    const { user } = useContext(AppContext);
    return user;
}

/**
 * @description returns the current user's avatar
 */
export function useUserAvatar() {
    const { userAvatar } = useContext(AppContext);
    return userAvatar;
}

export function useUserProfile() {
    const { userProfile } = useContext(AppContext);
    return userProfile;
}

export function useIsSmallScreen() {
    const { isSmallScreen } = useContext(AppContext);
    return isSmallScreen;
}

export function useAlertDialog() {
    const { alertDialog } = useContext(AppContext);
    return alertDialog;
}

export function useBlockList() {
    const { blockList } = useContext(AppContext);
    return blockList;
}

export function useStarList() {
    const { starList } = useContext(AppContext);
    return starList;
}

export function useSession() {
    const { session } = useContext(AppContext);
    return session;
}

export function useServerPublicKey() {
    const { serverPublicKey } = useContext(AppContext);
    return serverPublicKey;
}

export function useServerConfig() {
    const { serverConfig } = useContext(AppContext);
    return serverConfig;
}

export function useSidePanelExpanded() {
    const { sidePanelExpanded } = useContext(AppContext);
    return sidePanelExpanded;
}
