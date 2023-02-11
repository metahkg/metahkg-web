import React from "react";
import { Typography } from "@mui/material";
import { Link } from "./link";

export default function ReCaptchaNotice(props: { className?: string }) {
    const { className } = props;
    return (
        <Typography
            variant="body2"
            className={`text-metahkg-grey !text-xs !mt-2 ${className}`}
        >
            Metahkg is protected by reCAPTCHA. The Google{" "}
            <Link className="inline" href="https://policies.google.com/privacy">
                Privacy Policy
            </Link>{" "}
            and{" "}
            <Link className="inline" href="https://policies.google.com/terms">
                Terms of Service
            </Link>{" "}
            apply.
        </Typography>
    );
}
