import App from "./App";
import ContextProvider from "./components/ContextProvider";
import MenuProvider from "./components/MenuProvider";

export default function MetahkgWebApp(props: { reCaptchaSiteKey?: string }) {
    const { reCaptchaSiteKey } = props;
    return (
        <ContextProvider reCaptchaSiteKey={reCaptchaSiteKey}>
            <MenuProvider>
                <App />
            </MenuProvider>
        </ContextProvider>
    );
}
