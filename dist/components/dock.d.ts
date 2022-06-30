/// <reference types="react" />
import "./css/dock.css";
/**
 * mobile dock
 */
export default function Dock(props: {
    btns: {
        icon: JSX.Element;
        action: () => void;
    }[];
}): JSX.Element;
