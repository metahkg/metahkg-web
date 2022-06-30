import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from "react";
const ShareContext = createContext({});
/**
 * It creates a context object for the share popup.
 * @param props - {children: JSX Element}
 */
export function ShareProvider(props) {
    const [shareOpen, setShareOpen] = useState(false);
    const [shareTitle, setShareTitle] = useState("");
    const [shareLink, setShareLink] = useState("");
    return (_jsx(ShareContext.Provider, Object.assign({ value: {
            shareOpen: [shareOpen, setShareOpen],
            shareTitle: [shareTitle, setShareTitle],
            shareLink: [shareLink, setShareLink],
        } }, { children: props.children })));
}
/**
 * It returns the value of the `shareOpen` property from the `ShareContext` object
 * @returns The boolean value of the shareOpen state and a function to set the state.
 */
export function useShareOpen() {
    const { shareOpen } = useContext(ShareContext);
    return shareOpen;
}
/**
 * It returns the current value of the shareTitle state and a setter function for the shareTitle state
 * @returns The `useShareTitle` hook returns a tuple of two values. The first value is the title of the
 * share, and the second value is a function that can be used to set the title.
 */
export function useShareTitle() {
    const { shareTitle } = useContext(ShareContext);
    return shareTitle;
}
/**
 * It returns the current share link and a setter for the share link
 * @returns A tuple of the share link and a setter for the share link.
 */
export function useShareLink() {
    const { shareLink } = useContext(ShareContext);
    return shareLink;
}
//# sourceMappingURL=ShareProvider.js.map