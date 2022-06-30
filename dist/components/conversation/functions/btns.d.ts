/// <reference types="react" />
export default function useBtns(): {
    icon: JSX.Element;
    action: () => void;
    title: string;
}[];
