import React from "react";
/**
 * It creates a context object for the share popup.
 * @param props - {children: JSX Element}
 */
export declare function ShareProvider(props: {
    children: JSX.Element | JSX.Element[];
}): JSX.Element;
/**
 * It returns the value of the `shareOpen` property from the `ShareContext` object
 * @returns The boolean value of the shareOpen state and a function to set the state.
 */
export declare function useShareOpen(): [boolean, React.Dispatch<React.SetStateAction<boolean>>];
/**
 * It returns the current value of the shareTitle state and a setter function for the shareTitle state
 * @returns The `useShareTitle` hook returns a tuple of two values. The first value is the title of the
 * share, and the second value is a function that can be used to set the title.
 */
export declare function useShareTitle(): [string, React.Dispatch<React.SetStateAction<string>>];
/**
 * It returns the current share link and a setter for the share link
 * @returns A tuple of the share link and a setter for the share link.
 */
export declare function useShareLink(): [string, React.Dispatch<React.SetStateAction<string>>];
