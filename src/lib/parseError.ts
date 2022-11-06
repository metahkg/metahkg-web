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
