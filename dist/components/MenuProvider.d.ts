import React from "react";
import { summary } from "../types/conversation/summary";
/**
 * It creates a context object that is passed to the children.
 * @param props - { children: JSX.Element }
 * @returns The `MenuProvider` component is returning a `MenuContext.Provider` component. This is the
 * component that will be used to provide the context to the rest of the application.
 */
export default function MenuProvider(props: {
    children: JSX.Element;
}): JSX.Element;
/**
 * Use the value of the category in the MenuContext.
 * @returns The first value is the current value of the category. The second value is a setter function
 * that can be used to change the category.
 */
export declare function useCat(): [number, React.Dispatch<React.SetStateAction<number>>];
/**
 * It returns the current thread id and a setter for the id
 * @returns The thread id and a setter for the id.
 */
export declare function useId(): [number, React.Dispatch<React.SetStateAction<number>>];
/**
 * It returns the current profile id and a setter for the profile
 * @returns A tuple of the current profile id and a setter for the profile.
 */
export declare function useProfile(): [number, React.Dispatch<React.SetStateAction<number>>];
/**
 * It returns the menu enabled or not and a function that sets the it.
 * @returns The menu enabled or not and a function that sets it.
 */
export declare function useMenu(): [boolean, React.Dispatch<React.SetStateAction<boolean>>];
/**
 * It returns the selected value from the MenuContext.
 * @returns The selected menu item and a setter for the selected menu item.
 */
export declare function useSelected(): [number, React.Dispatch<React.SetStateAction<number>>];
/**
 * It returns the data from the MenuContext.
 * @returns The data array and a setter function.
 */
export declare function useData(): [summary[], React.Dispatch<React.SetStateAction<summary[]>>];
/**
 * It returns the current menu title and a setter for the title
 * @returns The menu title of the current page.
 */
export declare function useMenuTitle(): [string, React.Dispatch<React.SetStateAction<string>>];
/**
 * It returns a boolean and a function that sets the boolean.
 * @returns A boolean and a function that sets the boolean.
 */
export declare function useSearch(): [boolean, React.Dispatch<React.SetStateAction<boolean>>];
/**
 * It returns a boolean and a function that sets the boolean.
 * @returns A boolean and a setter function.
 */
export declare function useRecall(): [boolean, React.Dispatch<React.SetStateAction<boolean>>];
/**
 * smode is the search mode
 * 0: title
 * 1: op
 * It returns the current value of the smode state and a setter function.
 * @returns The smode value and a setter function.
 */
export declare function useSmode(): [number, React.Dispatch<React.SetStateAction<number>>];
