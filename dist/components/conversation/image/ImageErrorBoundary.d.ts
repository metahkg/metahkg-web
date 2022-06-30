import React from "react";
export default class ImageErrorBoundary extends React.Component<{
    src: string;
    children: JSX.Element;
}> {
    state: {
        hasError: boolean;
    };
    static getDerivedStateFromError(): {
        hasError: boolean;
    };
    render(): JSX.Element;
}
