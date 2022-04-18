import humanizeDurationShortened from "humanize-duration-shortened-english";
import humanizeDuration from "humanize-duration";

export function roundup(num: number, precision = 0): number {
    precision = Math.pow(10, precision);
    return Math.ceil(num * precision) / precision;
}

export function timetoword(sdate: string): string {
    const startDate = new Date(sdate);
    const endDate = new Date();
    const diff = endDate.getTime() - startDate.getTime();
    const shortened: string = humanizeDurationShortened(diff, {
        round: true,
        spacer: "",
        delimiter: " ",
    });
    let r: string = shortened.split(" ")[0];
    if (r.endsWith("s")) {
        r = "now";
    }
    return r;
}

export function timetoword_long(sdate: string): string {
    const startDate = new Date(sdate);
    const endDate = new Date();
    const diff = endDate.getTime() - startDate.getTime();
    let r: any = humanizeDuration(diff, {
        round: true,
        spacer: " ",
        delimiter: ",",
    });
    r = r.split(",");
    return r[0];
}

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function splitarray(arr: any[], start: number, end: number) {
    const r: any[] = [];
    for (let i = start; i <= end; i++) {
        arr[i] !== undefined && r.push(arr[i]);
    }
    return r;
}

export function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("id");
    localStorage.removeItem("token");
}

export function wholepath(): string {
    return window.location.href.replace(window.location.origin, "");
}

export function checkpwd(pwd: string): boolean {
    if (pwd.length < 8) {
        return false;
    }
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

export function allequal(arr: any[]) {
    const first = arr[0];
    for (const i of arr) {
        if (i !== first) return false;
    }
    return true;
}
