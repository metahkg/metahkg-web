import React from "react";
import ReactCaptcha from "@metahkg/react-captcha";
import {
    useDarkMode,
    useReCaptchaSiteKey,
    useServerConfig,
    useTurnstileSiteKey,
} from "../components/AppContextProvider";

const CAPTCHA = React.forwardRef((_props, ref: React.LegacyRef<ReactCaptcha>) => {
    const [serverConfig] = useServerConfig();
    const darkMode = useDarkMode();
    const turnstileSiteKey = useTurnstileSiteKey();
    const recaptchaSiteKey = useReCaptchaSiteKey();

    return (
        <ReactCaptcha
            ref={ref}
            theme={darkMode ? "dark" : "light"}
            sitekey={
                serverConfig?.captcha === "turnstile"
                    ? turnstileSiteKey
                    : recaptchaSiteKey
            }
            size={serverConfig?.captcha === "turnstile" ? "normal" : "invisible"}
            useTurnstile={serverConfig?.captcha === "turnstile"}
        />
    );
});

export default CAPTCHA;
