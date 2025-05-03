import React from "react";
import { Typography } from "@mui/material";
import { Link } from "./link";
import { useServerConfig } from "../components/AppContextProvider";
import { memo } from "react";
import { useTranslation } from "react-i18next";
const CaptchaNotice = memo(function CaptchaNotice(props: { className?: string }) {
    const { t } = useTranslation();
    const { className } = props;
    const [serverConfig] = useServerConfig();
    return (
        <Typography
            variant="body2"
            className={`text-metahkg-grey !text-xs !mt-2 ${className}`}
        >
            {serverConfig?.branding || t("common.branding")}
            {t("captcha_notice.protected_by")}
            {serverConfig?.captcha.type === "turnstile"
                ? t("captcha_notice.cloudflare_turnstile")
                : t("captcha_notice.recaptcha")}
            {t("captcha_notice.the")}{" "}
            {serverConfig?.captcha.type === "turnstile"
                ? t("captcha_notice.cloudflare")
                : t("captcha_notice.google")}{" "}
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
                {t("captcha_notice.privacy_policy")}
            </Link>{" "}
            {t("captcha_notice.and")}{" "}
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
                {t("captcha_notice.terms_of_service")}
            </Link>{" "}
            {t("captcha_notice.apply")}
        </Typography>
    );
});
export default CaptchaNotice;
