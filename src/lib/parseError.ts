import { AxiosError } from "axios";

export function parseError(err: AxiosError<any>): string {
    try {
        if (err.response?.data?.error) return err.response.data.error;

        if (err.response?.data && err.response.data?.length < 50)
            return err.response.data;

        if (err.response?.statusText)
            return `${err.response?.status} ${err.response?.statusText}`;
        else return "An error occurred.";
    } catch {
        return "An error occurred.";
    }
}
