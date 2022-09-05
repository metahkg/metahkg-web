import { AxiosError } from "axios";

export function parseError(err: AxiosError<any> | any): string {
    console.log(err);
    try {
        if (typeof err.response?.data?.error === "string") return err.response.data.error;
        if (typeof err.error === "string") return err.error;

        if (typeof err.response?.data === "string" && err.response.data?.length < 50)
            return err.response.data;

        if (typeof err === "string" && err?.length < 50) return err;

        if (err.response?.statusText)
            return `${err.response?.status} ${err.response?.statusText}`;
        else return "An error occurred.";
    } catch {
        return "An error occurred.";
    }
}
