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

import { Client } from "@metahkg/api";
import { Session } from "../types/session";
import Axios from "axios";

const axios = Axios.create();

axios.interceptors.request.use((config) => {
    const token = (
        JSON.parse(localStorage.getItem("session") || "null") as Session | null
    )?.token;
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const api = new Client(process.env.REACT_APP_BACKEND || "/api", axios);
