import humanizeDuration from "humanize-duration";
import jwtDecode from "jwt-decode";
import { userType } from "../types/user";

export function roundup(num: number, precision = 0): number {
    precision = Math.pow(10, precision);
    return Math.ceil(num * precision) / precision;
}

export const shortEnglishHumanizer = humanizeDuration.humanizer({
    language: "shortEn",
    languages: {
        shortEn: {
            y: () => "y",
            mo: () => "mo",
            w: () => "w",
            d: () => "d",
            h: () => "h",
            m: () => "m",
            s: () => "s",
            ms: () => "ms",
        },
    },
});

export function timeToWord(sDate: string): string {
    const startDate = new Date(sDate);
    const endDate = new Date();
    const diff = endDate.getTime() - startDate.getTime();
    const shortened: string = shortEnglishHumanizer(diff, {
        round: true,
        spacer: "",
        delimiter: " ",
    });
    let r = shortened.split(" ")[0];
    if (r.endsWith("s")) r = "now";
    return r;
}

export function timeToWord_long(sDate: string): string {
    const startDate = new Date(sDate);
    const endDate = new Date();
    const diff = endDate.getTime() - startDate.getTime();
    let r = humanizeDuration(diff, {
        round: true,
        spacer: " ",
        delimiter: ",",
    });
    return r.split(",")[0];
}

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function wholePath() {
    return window.location.href.replace(window.location.origin, "");
}

export function checkPwd(pwd: string): boolean {
    if (pwd.length < 8) return false;

    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = lower.toUpperCase();
    const numbers = "1234567890";
    for (const i of [lower, upper, numbers]) {
        let contain = false;
        for (const p of pwd) {
            if (i.includes(p)) {
                contain = true;
                break;
            }
        }
        if (!contain) {
            return false;
        }
    }
    return true;
}

export function allEqual(arr: any[]) {
    const first = arr[0];
    for (const i of arr) {
        if (i !== first) return false;
    }
    return true;
}

export function setTitle(title: string = "Metahkg") {
    document.title = title;
    document.querySelector(`meta[property="og:title"]`)?.setAttribute("content", title);
    document.querySelector(`meta[name="twitter:title"]`)?.setAttribute("content", title);
}

export function setDescription(
    description: string = "Metahkg is a free and open source lihkg-style forum."
) {
    document
        .querySelector(`meta[name="description"]`)
        ?.setAttribute("content", description);
    document
        .querySelector(`meta[property="og:description"]`)
        ?.setAttribute("content", description);
    document
        .querySelector(`meta[name="twitter:description"]`)
        ?.setAttribute("content", description);
}

export const decodeToken = (token?: string) => {
    try {
        return jwtDecode(token || "") as userType | null;
    } catch {
        return null;
    }
};

export const reCaptchaSiteKey = process.env.recaptchasitekey || "{RECAPTCHA_SITE_KEY}";
