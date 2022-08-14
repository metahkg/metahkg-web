import React from "react";
import { toJSON } from "@wc-yat/csstojson/dist/toJSON";
import { format } from "prettier/standalone";
import prettierCss from "prettier/parser-postcss";

export default function cssToReact(css: string): React.CSSProperties {
    try {
        return Object.fromEntries(
            Object.entries(
                toJSON(
                    format(css, {
                        parser: "css",
                        plugins: [prettierCss],
                    }).replaceAll("\n", "")
                ).attributes
            ).map(([k, v]) => [
                k.replace(/-[a-z]/g, (match) => {
                    return match[1].toUpperCase();
                }),
                v,
            ])
        );
    } catch {
        return {};
    }
}
