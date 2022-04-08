import React, {createContext, useContext, useState} from "react";
import {summary} from "../types/conversation/summary";

const MenuContext = createContext<{
    category: [number, React.Dispatch<React.SetStateAction<number>>];
    id: [number, React.Dispatch<React.SetStateAction<number>>];
    search: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    profile: [
            number | "self",
        React.Dispatch<React.SetStateAction<number | "self">>
    ];
    menu: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    selected: [number, React.Dispatch<React.SetStateAction<number>>];
    recall: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    data: [summary[], React.Dispatch<React.SetStateAction<summary[]>>];
    title: [string, React.Dispatch<React.SetStateAction<string>>];
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
    const [profile, setProfile] = useState<number | "self">(0);
    const [search, useSearch] = useState(false);
    const [menu, setMenu] = useState(false);
    const [recall, setRecall] = useState(false);
    const [selected, setSelected] = useState(0);
    const [data, setData] = useState<any[]>([]);
    const [title, setTitle] = useState("");
    const [smode, setSmode] = useState(0); //search mode
    return (
        <MenuContext.Provider
            value={{
                category: [category, setCategory],
                id: [id, setId],
                search: [search, useSearch],
                profile: [profile, setProfile],
                menu: [menu, setMenu],
                selected: [selected, setSelected],
                recall: [recall, setRecall],
                data: [data, setData],
                title: [title, setTitle],
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
export function useCat(): [
    number,
    React.Dispatch<React.SetStateAction<number>>
] {
    const {category} = useContext(MenuContext);
    return category;
}

/**
 * It returns the current thread id and a setter for the id
 * @returns The thread id and a setter for the id.
 */
export function useId() {
    const {id} = useContext(MenuContext);
    return id;
}

/**
 * It returns the current profile id and a setter for the profile
 * @returns A tuple of the current profile id and a setter for the profile.
 */
export function useProfile() {
    const {profile} = useContext(MenuContext);
    return profile;
}

/**
 * It returns the menu enabled or not and a function that sets the it.
 * @returns The menu enabled or not and a function that sets it.
 */
export function useMenu() {
    const {menu} = useContext(MenuContext);
    return menu;
}

/**
 * It returns the selected value from the MenuContext.
 * @returns The selected menu item and a setter for the selected menu item.
 */
export function useSelected() {
    const {selected} = useContext(MenuContext);
    return selected;
}

/**
 * It returns the data from the MenuContext.
 * @returns The data array and a setter function.
 */
export function useData() {
    const {data} = useContext(MenuContext);
    return data;
}

/**
 * It returns the current menu title and a setter for the title
 * @returns The menu title of the current page.
 */
export function useTitle() {
    const {title} = useContext(MenuContext);
    return title;
}

/**
 * It returns a boolean and a function that sets the boolean.
 * @returns A boolean and a function that sets the boolean.
 */
export function useSearch() {
    const {search} = useContext(MenuContext);
    return search;
}

/**
 * It returns a boolean and a function that sets the boolean.
 * @returns A boolean and a setter function.
 */
export function useRecall() {
    const {recall} = useContext(MenuContext);
    return recall;
}

/**
 * smode is the search mode
 * 0: title
 * 1: op
 * It returns the current value of the smode state and a setter function.
 * @returns The smode value and a setter function.
 */
export function useSmode() {
    const {smode} = useContext(MenuContext);
    return smode;
}
