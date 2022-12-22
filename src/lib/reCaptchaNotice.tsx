import React from "react";

export default function ReCaptchaNotice(props: { className?: string }) {
    const { className } = props;
    return (
        <p className={`text-[12px] text-metahkg-grey ${className}`}>
            Metahkg is protected by reCAPTCHA. The Google{" "}
            <a className="inline" href="https://policies.google.com/privacy">
                Privacy Policy
            </a>{" "}
            and{" "}
            <a className="inline" href="https://policies.google.com/terms">
                Terms of Service
            </a>{" "}
            apply.
        </p>
    );
}
