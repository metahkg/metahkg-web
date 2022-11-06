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

type menuMode = "category" | "search" | "profile" | "recall" | "starred";

const MenuContext = createContext<{
    category: [number, React.Dispatch<React.SetStateAction<number>>];
    id: [number, React.Dispatch<React.SetStateAction<number>>];
    profile: [number, React.Dispatch<React.SetStateAction<number>>];
    menu: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    menuMode: [menuMode, React.Dispatch<React.SetStateAction<menuMode>>];
    selected: [number, React.Dispatch<React.SetStateAction<number>>];
    reFetch: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    menuTitle: [string, React.Dispatch<React.SetStateAction<string>>];
    smode: [number, React.Dispatch<React.SetStateAction<number>>];
    // @ts-ignore
}>({});

/**
 * It creates a context object that is passed to the children.
 * @param props - { children: JSX.Element }
 * @returns The `MenuProvider` component is returning a `MenuContext.Provider` component. This is the
 * component that will be used to provide the context to the rest of the application.
 */
export default function MenuProvider(props: { children: JSX.Element }) {
    const [category, setCategory] = useState(0);
    const [id, setId] = useState(0);
    const [profile, setProfile] = useState<number>(0);
    const [menu, setMenu] = useState(false);
    const [menuMode, setMenuMode] = useState<menuMode>("category");
    const [selected, setSelected] = useState(0);
    const [reFetch, setReFetch] = useState<boolean>(false);
    const [menuTitle, setMenuTitle] = useState("");
    const [smode, setSmode] = useState(0); //search mode
    return (
        <MenuContext.Provider
            value={{
                category: [category, setCategory],
                id: [id, setId],
                profile: [profile, setProfile],
                menu: [menu, setMenu],
                menuMode: [menuMode, setMenuMode],
                selected: [selected, setSelected],
                reFetch: [reFetch, setReFetch],
                menuTitle: [menuTitle, setMenuTitle],
                smode: [smode, setSmode],
            }}
        >
            {props.children}
        </MenuContext.Provider>
    );
}

/**
 * Use the value of the category in the MenuContext.
 * @returns The first value is the current value of the category. The second value is a setter function
 * that can be used to change the category.
 */
export function useCat(): [number, React.Dispatch<React.SetStateAction<number>>] {
    const { category } = useContext(MenuContext);
    return category;
}

/**
 * It returns the current thread id and a setter for the id
 * @returns The thread id and a setter for the id.
 */
export function useId() {
    const { id } = useContext(MenuContext);
    return id;
}

/**
 * It returns the current profile id and a setter for the profile
 * @returns A tuple of the current profile id and a setter for the profile.
 */
export function useProfile() {
    const { profile } = useContext(MenuContext);
    return profile;
}

/**
 * It returns the menu enabled or not and a function that sets the it.
 * @returns The menu enabled or not and a function that sets it.
 */
export function useMenu() {
    const { menu } = useContext(MenuContext);
    return menu;
}

/**
 * It returns the selected value from the MenuContext.
 * @returns The selected menu item and a setter for the selected menu item.
 */
export function useSelected() {
    const { selected } = useContext(MenuContext);
    return selected;
}

/**
 * It returns the data from the MenuContext.
 * @returns The data array and a setter function.
 */
export function useReFetch() {
    const { reFetch } = useContext(MenuContext);
    return reFetch;
}

/**
 * It returns the current menu title and a setter for the title
 * @returns The menu title of the current page.
 */
export function useMenuTitle() {
    const { menuTitle } = useContext(MenuContext);
    return menuTitle;
}

/**
 * smode is the search mode
 * 0: title
 * 1: op
 * It returns the current value of the smode state and a setter function.
 * @returns The smode value and a setter function.
 */
export function useSmode() {
    const { smode } = useContext(MenuContext);
    return smode;
}

export function useMenuMode() {
    const { menuMode } = useContext(MenuContext);
    return menuMode;
}
