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
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import type { history } from "../types/history";
import type { notification } from "../types/notification";
import type { settings } from "../types/settings";
import { api } from "../lib/api";
import jwtDecode from "jwt-decode";
import { AlertDialogProps } from "../lib/alertDialog";
import { BlockedUser, Category, User, Star, Session } from "@metahkg/api";

export const AppContext = createContext<{
    back: [string, Dispatch<SetStateAction<string>>];
    query: [string, Dispatch<SetStateAction<string>>];
    width: [number, Dispatch<SetStateAction<number>>];
    height: [number, Dispatch<SetStateAction<number>>];
    notification: [notification, Dispatch<SetStateAction<notification>>];
    settingsOpen: [boolean, Dispatch<SetStateAction<boolean>>];
    settings: [settings, Dispatch<SetStateAction<settings>>];
    history: [history, Dispatch<SetStateAction<history>>];
    categories: [Category[], Dispatch<Category[]>];
    user: [User | null, Dispatch<SetStateAction<User | null>>];
    session: [Session | null, Dispatch<SetStateAction<Session | null>>];
    alertDialog: [AlertDialogProps, Dispatch<SetStateAction<AlertDialogProps>>];
    reCaptchaSiteKey: string;
    blockList: [BlockedUser[], Dispatch<SetStateAction<BlockedUser[]>>];
    starList: [Star[], Dispatch<SetStateAction<Star[]>>];
    //@ts-ignore
}>(null);
/**
 * Holds global application values.
 * @param props - { children: JSX.Element }
 * @returns The AppContextProvider is returning a JSX element.
 */
export default function AppContextProvider(props: {
    children: JSX.Element;
    reCaptchaSiteKey?: string;
}) {
    const [back, setBack] = useState("");
    const [query, setQuery] = useState(localStorage.query || "");
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);
    const [notification, setNotification] = useState({ open: false, text: "" });
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [settings, setSettings] = useState<settings>(
        JSON.parse(
            localStorage.getItem("settings") ||
                JSON.stringify({ secondaryColor: { main: "#f5bd1f", dark: "#ffc100" } })
        )
    );
    const [user, setUser] = useState(
        (() => {
            try {
                return jwtDecode(localStorage.token || "") as User | null;
            } catch {
                return null;
            }
        })()
    );
    const [session, setSession] = useState<Session | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const parsedHistory: { id: number; cid: number; c: number }[] = JSON.parse(
        localStorage.getItem("history") || "[]"
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
    const [reCaptchaSiteKey] = useState(
        props.reCaptchaSiteKey ||
            process.env.REACT_APP_recaptchasitekey ||
            "{RECAPTCHA_SITE_KEY}"
    );
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
        JSON.parse(localStorage.getItem("blocklist") || "[]")
    );
    const [starList, setStarList] = useState<Star[]>(
        JSON.parse(localStorage.getItem("starlist") || "[]")
    );

    useEffect(() => {
        api.categories().then(setCategories);
    }, []);

    useEffect(() => {
        if (user) {
            api.meBlocked().then(setBlockList);
            setInterval(() => {
                api.meBlocked().then(setBlockList);
            }, 1000 * 60 * 10);

            api.meStarred().then(setStarList);
            setInterval(() => {
                api.meStarred().then(setStarList);
            }, 1000 * 60 * 10);
        }
    }, [user]);

    useEffect(() => {
        localStorage.setItem("history", JSON.stringify(history));
    }, [history]);

    useEffect(() => {
        localStorage.setItem("query", query);
    }, [query]);

    useEffect(() => {
        localStorage.setItem("settings", JSON.stringify(settings));
    }, [settings]);

    useEffect(() => {
        localStorage.setItem("blocklist", JSON.stringify(blockList));
    }, [blockList]);

    useEffect(() => {
        localStorage.setItem("starlist", JSON.stringify(starList));
    }, [starList]);

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
                query: [query, setQuery],
                height: [height, setHeight],
                notification: [notification, setNotification],
                settingsOpen: [settingsOpen, setSettingsOpen],
                settings: [settings, setSettings],
                history: [history, setHistory],
                categories: [categories, setCategories],
                user: [user, setUser],
                session: [session, setSession],
                reCaptchaSiteKey,
                alertDialog: [alertDialog, setAlertDialog],
                blockList: [blockList, setBlockList],
                starList: [starList, setStarList],
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
    return categories[0];
}

export function useUser() {
    const { user } = useContext(AppContext);
    return user;
}

export function useIsSmallScreen() {
    const { width } = useContext(AppContext);
    return width[0] < 760;
}

export function useReCaptchaSiteKey() {
    const { reCaptchaSiteKey } = useContext(AppContext);
    return reCaptchaSiteKey;
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
