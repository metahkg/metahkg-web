/// <reference types="react" />
import "./css/title.css";
/**
 * It's a component that renders the title of the thread.
 * @param {number} props.category The category of the thread
 * @param {string} props.title The title of of the thread
 * @param {string} props.slink The shortened link of the thread
 */
export default function Title(props: {
    /** thread category id */
    category: number | undefined;
    /** thread title */
    title: string | undefined;
    /** buttons */
    btns: {
        icon: JSX.Element;
        action: () => void;
        title: string;
    }[];
}): JSX.Element;
