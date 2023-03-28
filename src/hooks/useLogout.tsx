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

import { useNotification } from "../components/AppContextProvider";
import { api } from "../lib/api";
import { parseError } from "../lib/parseError";
import { useClearSession } from "./useClearSession";

export function useLogout() {
    const [, setNotification] = useNotification();
    const clearSession = useClearSession();

    return async () => {
        setNotification({
            open: true,
            severity: "info",
            text: "Logging you out...",
        });
        await api
            .authLogout()
            .then(() => {
                clearSession();
                setNotification({
                    open: true,
                    severity: "success",
                    text: "Logged out.",
                });
            })
            .catch((err) => {
                setNotification({
                    open: true,
                    severity: "error",
                    text: parseError(err),
                });
            });
    };
}
