import React from "react";
import type { history } from "../types/history";
import type { notification } from "../types/notification";
import type { settings } from "../types/settings";
import type { category } from "../types/category";
import { userType } from "../types/user";
/**
 * Holds global application values.
 * @param props - { children: JSX.Element }
 * @returns The ContextProvider is returning a JSX element.
 */
export default function ContextProvider(props: {
    children: JSX.Element;
}): JSX.Element;
/**
 * It returns the current history and a setter for the history
 * @returns The history object and a setter function.
 */
export declare function useBack(): [string, React.Dispatch<React.SetStateAction<string>>];
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
export declare function useWidth(): [number, React.Dispatch<React.SetStateAction<number>>];
/**
 * It returns a tuple of the last search query and a setter function for the query
 * @returns A tuple of two values. The first value is the query, and the second value is a
 * setter function for the query.
 */
export declare function useQuery(): [string, React.Dispatch<React.SetStateAction<string>>];
/**
 * "Use the height value from the Context."
 *
 * The function returns a tuple of two values:
 *
 * The height value from the Context.
 * A setter function for the height value in the Context
 * @returns The height of the window and a setter for the height of the window.
 */
export declare function useHeight(): [number, React.Dispatch<React.SetStateAction<number>>];
/**
 * It returns a tuple of two values. The first value is an object that represents the state of the
 * notification. The second value is a function that sets the state of the notification
 * @returns A tuple of two values. The first value is the current state of the notification. The second
 * value is a function that can be used to update the state of the notification.
 */
export declare function useNotification(): [notification, React.Dispatch<React.SetStateAction<notification>>];
/**
 * It returns the value of the settingsOpen state and a setter function for that state
 * @returns The boolean value of the settingsOpen state and a function to set the state.
 */
export declare function useSettingsOpen(): [boolean, React.Dispatch<React.SetStateAction<boolean>>];
/**
 * It returns the settings object and a setter function
 * @returns A tuple of the settings object and a setter function.
 */
export declare function useSettings(): [settings, React.Dispatch<React.SetStateAction<settings>>];
/**
 * It returns the history of the current user
 * @returns The history array and a setter function.
 */
export declare function useHistory(): [history, React.Dispatch<React.SetStateAction<history>>];
export declare function useCategories(): category[];
export declare function useUser(): [userType, React.Dispatch<React.SetStateAction<userType>>];
export declare function useIsSmallScreen(): boolean;
