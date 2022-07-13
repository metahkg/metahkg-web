import React, { useLayoutEffect } from "react";
import { useMenu } from "../../MenuProvider";

export default function DisableMenu(props: { children: React.ReactNode }) {
    const { children } = props;
    const [menu, setMenu] = useMenu();

    useLayoutEffect(() => {
        menu && setMenu(false);
    }, [menu, setMenu]);

    return <React.Fragment>{children}</React.Fragment>;
}
