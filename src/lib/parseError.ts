import { ErrorDto } from "@metahkg/api";
import { AxiosError } from "axios";

export function parseError(err: AxiosError<any> | ErrorDto | any): string {
    try {
        let message = "";
        if (typeof err?.statusCode === "number") message += `${err.statusCode} `;
        else if (typeof err?.response?.statusCode === "number") message += err.statusCode;

        if (typeof err?.response?.data?.error === "string") {
            message += err.response.data.error;
            return message;
        }

        if (typeof err?.error === "string") {
            message += err.error;
            return message;
        }

        if (typeof err?.response?.data === "string" && err.response.data?.length < 50) {
            message += err.response.data;
            return message;
        }

        if (typeof err === "string" && err?.length < 50) {
            message += err;
            return message;
        }

        if (err?.response?.statusText)
            return `${err?.response?.status} ${err?.response?.statusText}`;
        else return "An error occurred.";
    } catch {
        return "An error occurred.";
    }
}
