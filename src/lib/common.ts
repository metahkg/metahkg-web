import humanizeDurationShortened from "humanize-duration-shortened-english";
import humanizeDuration from "humanize-duration";
import axios from "axios";
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
export type severity = "success" | "info" | "warning" | "error";
export type summary = {
  c: number;
  id: number;
  op: string;
  sex: "M" | "F";
  title: string;
  category: number;
  lastModified: string;
  createdAt: string;
  vote: number;
};
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export const categories: { id: number; name: string; hidden?: boolean }[] =
  JSON.parse(process.env.REACT_APP_categories || "[]");
export function splitarray(arr: any[], start: number, end: number) {
  const r: any[] = [];
  for (let i = start; i <= end; i++) {
    arr[i] !== undefined && r.push(arr[i]);
  }
  return r;
}
export async function logout() {
  await axios.get("/api/logout");
  localStorage.removeItem("user");
  localStorage.removeItem("id");
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
