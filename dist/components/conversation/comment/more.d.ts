/// <reference types="react" />
export default function MoreList(props: {
    buttons: ({
        title: string;
        icon?: JSX.Element;
        action: () => void;
    } | undefined)[];
}): JSX.Element;
