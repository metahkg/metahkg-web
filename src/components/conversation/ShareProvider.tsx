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

import React, { createContext, useContext, useState } from "react";

const ShareContext = createContext<any>({});

/**
 * It creates a context object for the share popup.
 * @param props - {children: JSX Element}
 */
export function ShareProvider(props: { children: JSX.Element | JSX.Element[] }) {
    const [shareOpen, setShareOpen] = useState(false);
    const [shareTitle, setShareTitle] = useState("");
    const [shareLink, setShareLink] = useState("");
    return (
        <ShareContext.Provider
            value={{
                shareOpen: [shareOpen, setShareOpen],
                shareTitle: [shareTitle, setShareTitle],
                shareLink: [shareLink, setShareLink],
            }}
        >
            {props.children}
        </ShareContext.Provider>
    );
}

/**
 * It returns the value of the `shareOpen` property from the `ShareContext` object
 * @returns The boolean value of the shareOpen state and a function to set the state.
 */
export function useShareOpen(): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
    const { shareOpen } = useContext(ShareContext);
    return shareOpen;
}

/**
 * It returns the current value of the shareTitle state and a setter function for the shareTitle state
 * @returns The `useShareTitle` hook returns a tuple of two values. The first value is the title of the
 * share, and the second value is a function that can be used to set the title.
 */
export function useShareTitle(): [string, React.Dispatch<React.SetStateAction<string>>] {
    const { shareTitle } = useContext(ShareContext);
    return shareTitle;
}

/**
 * It returns the current share link and a setter for the share link
 * @returns A tuple of the share link and a setter for the share link.
 */
export function useShareLink(): [string, React.Dispatch<React.SetStateAction<string>>] {
    const { shareLink } = useContext(ShareContext);
    return shareLink;
}
