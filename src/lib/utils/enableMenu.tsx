import React, { useLayoutEffect } from "react";
import { useIsSmallScreen } from "../../components/AppContextProvider";
import { useMenu } from "../../components/MenuProvider";

export default function EnableMenu(props: {
    children: React.ReactNode;
    notOnSmallScreen?: boolean;
}) {
    const { children, notOnSmallScreen: noSmallScreen } = props;
    const [menu, setMenu] = useMenu();
    const isSmallScreen = useIsSmallScreen();

    useLayoutEffect(() => {
        if (!menu && (!noSmallScreen || !isSmallScreen)) setMenu(true);
        if (menu && noSmallScreen && isSmallScreen) setMenu(false);
    }, [isSmallScreen, menu, noSmallScreen, setMenu]);

    return <React.Fragment>{children}</React.Fragment>;
}
