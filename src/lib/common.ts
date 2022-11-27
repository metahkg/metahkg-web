/*
 Copyright (C) 2022-present Metahkg Contributors

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { User } from "@metahkg/api";
import humanizeDuration from "humanize-duration";
import jwtDecode from "jwt-decode";

export const imagesApi = `https://${
    process.env.REACT_APP_IMAGES_DOMAIN || "i.metahkg.org"
}`;

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

export function timeToWord(sDate: string | Date): string {
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

export function timeToWord_long(sDate: string | Date): string {
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

export function checkPassword(password: string): boolean {
    if (password.length < 8) return false;

    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = lower.toUpperCase();
    const numbers = "1234567890";
    for (const i of [lower, upper, numbers]) {
        let contain = false;
        for (const p of password) {
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

export function setTitle(title = "Metahkg") {
    document.title = title;
    document.querySelector(`meta[property="og:title"]`)?.setAttribute("content", title);
    document.querySelector(`meta[name="twitter:title"]`)?.setAttribute("content", title);
}

export function setDescription(
    description = "Metahkg is a free and open source lihkg-style forum."
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
        return jwtDecode(token || "") as User | null;
    } catch {
        return null;
    }
};
