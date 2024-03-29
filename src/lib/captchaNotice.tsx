import React from "react";
import { Typography } from "@mui/material";
import { Link } from "./link";
import { useServerConfig } from "../components/AppContextProvider";

export default function CaptchaNotice(props: { className?: string }) {
    const { className } = props;
    const [serverConfig] = useServerConfig();
    return (
        <Typography
            variant="body2"
            className={`text-metahkg-grey !text-xs !mt-2 ${className}`}
        >
            {serverConfig?.branding || "Metahkg"} is protected by{" "}
            {serverConfig?.captcha.type === "turnstile"
                ? "Cloudflare Turnstile"
                : "reCAPTCHA"}
            . The {serverConfig?.captcha.type === "turnstile" ? "Cloudflare" : "Google"}{" "}
            <Link
                className="inline"
                target="_blank"
                rel="noopener noreferrer"
                href={
                    serverConfig?.captcha.type === "turnstile"
                        ? "https://www.cloudflare.com/privacypolicy"
                        : "https://policies.google.com/privacy"
                }
            >
                Privacy Policy
            </Link>{" "}
            and{" "}
            <Link
                className="inline"
                target="_blank"
                rel="noopener noreferrer"
                href={
                    serverConfig?.captcha.type === "turnstile"
                        ? "https://www.cloudflare.com/website-terms/"
                        : "https://www.google.com/policies/terms"
                }
            >
                Terms of Service
            </Link>{" "}
            apply.
        </Typography>
    );
}
