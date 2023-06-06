import React, { useImperativeHandle, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import Turnstile from "react-turnstile";
import { useDarkMode, useServerConfig } from "../components/AppContextProvider";

export interface CaptchaRefProps {
    token: string | null;
    reset: () => void;
    execute: () => void;
    executeAsync: () => Promise<string | null>;
}

const CAPTCHA = React.forwardRef(
    (
        props: {
            mode?: "recaptcha" | "turnstile";
            theme?: "dark" | "light";
            siteKey?: string;
            timeout?: number;
        },
        ref: React.ForwardedRef<CaptchaRefProps>
    ) => {
        const { theme, siteKey } = props;
        const [token, setToken] = useState<string | null>(null);
        const [reload, setReload] = useState<boolean>(false);
        const RecaptchaRef = useRef<ReCAPTCHA>(null);
        const darkMode = useDarkMode();
        const [serverConfig] = useServerConfig();
        const mode = props.mode || serverConfig?.captcha.type || "recaptcha";
        const timeout = props.timeout || 5000;

        useImperativeHandle(ref, () => ({
            token,
            reset: () => {
                if (mode === "turnstile") {
                    setReload(!reload);
                } else {
                    RecaptchaRef.current?.reset();
                }
                setToken(null);
            },
            execute: () => {
                if (mode === "recaptcha") {
                    RecaptchaRef.current?.execute();
                }
            },
            executeAsync: async () => {
                if (mode === "recaptcha") {
                    return (await RecaptchaRef.current?.executeAsync()) || null;
                } else {
                    let waitTime = 0;
                    while (!token) {
                        if (waitTime >= timeout) {
                            setReload(!reload);
                            return null;
                        }
                        await new Promise((resolve) => setTimeout(resolve, 100));
                        waitTime += 100;
                    }
                    return token;
                }
            },
        }));

        if (mode === "turnstile") {
            return (
                <Turnstile
                    key={Number(reload)}
                    theme={theme || (darkMode ? "dark" : "light")}
                    sitekey={siteKey || serverConfig?.captcha.siteKey || ""}
                    onVerify={setToken}
                    onExpire={() => setToken(null)}
                    onTimeout={() => {
                        setReload(!reload);
                        setToken(null);
                    }}
                    size={"normal"}
                />
            );
        } else {
            return (
                <ReCAPTCHA
                    ref={RecaptchaRef}
                    sitekey={siteKey || serverConfig?.captcha.siteKey || ""}
                    theme={theme || (darkMode ? "dark" : "light")}
                    onChange={setToken}
                    onExpired={() => setToken(null)}
                    size={"invisible"}
                />
            );
        }
    }
);

export default CAPTCHA;
