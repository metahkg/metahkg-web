import humanizeDuration from "humanize-duration";
import jwtDecode from "jwt-decode";
export function roundup(num, precision = 0) {
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
export function timeToWord(sDate) {
    const startDate = new Date(sDate);
    const endDate = new Date();
    const diff = endDate.getTime() - startDate.getTime();
    const shortened = shortEnglishHumanizer(diff, {
        round: true,
        spacer: "",
        delimiter: " ",
    });
    let r = shortened.split(" ")[0];
    if (r.endsWith("s"))
        r = "now";
    return r;
}
export function timeToWord_long(sDate) {
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
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
export function wholePath() {
    return window.location.href.replace(window.location.origin, "");
}
export function checkPwd(pwd) {
    if (pwd.length < 8)
        return false;
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
export function allEqual(arr) {
    const first = arr[0];
    for (const i of arr) {
        if (i !== first)
            return false;
    }
    return true;
}
export function setTitle(title = "Metahkg") {
    var _a, _b;
    document.title = title;
    (_a = document.querySelector(`meta[property="og:title"]`)) === null || _a === void 0 ? void 0 : _a.setAttribute("content", title);
    (_b = document.querySelector(`meta[name="twitter:title"]`)) === null || _b === void 0 ? void 0 : _b.setAttribute("content", title);
}
export function setDescription(description = "Metahkg is a free and open source lihkg-style forum.") {
    var _a, _b, _c;
    (_a = document
        .querySelector(`meta[name="description"]`)) === null || _a === void 0 ? void 0 : _a.setAttribute("content", description);
    (_b = document
        .querySelector(`meta[property="og:description"]`)) === null || _b === void 0 ? void 0 : _b.setAttribute("content", description);
    (_c = document
        .querySelector(`meta[name="twitter:description"]`)) === null || _c === void 0 ? void 0 : _c.setAttribute("content", description);
}
export const decodeToken = (token) => {
    try {
        return jwtDecode(token || "");
    }
    catch (_a) {
        return null;
    }
};
export const reCaptchaSiteKey = process.env.recaptchasitekey || "{RECAPTCHA_SITE_KEY}";
//# sourceMappingURL=common.js.map