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

import {ErrorDto} from "@metahkg/api";
import {useEffect} from "react";
import {useNotification, useSession, useUser} from "../../components/AppContextProvider";
import { api } from "../../lib/api";
import { parseError } from "../../lib/parseError";
import {useLogout} from "../useLogout";

export function useCheckSession() {
    const [user] = useUser();
    const [session, setSession] = useSession();
    const [, setNotification] = useNotification();
    const logout = useLogout();
    useEffect(() => {
        if (user && session) {
            api.authSessionCurrent()
                .catch(async (data?: ErrorDto) => {
                    if (data?.statusCode === 401) {
                        await api.authSessionsRefresh(session.id, {
                            refreshToken: session.refreshToken
                        }).then(({token, refreshToken}) => {
                            setSession({...session, token, refreshToken});
                        }).catch(async (data?: ErrorDto) => {
                            if ([401, 403, 404].includes(data?.statusCode || 0)) {
                                logout();
                            } else {
                                setNotification({
                                    open: true,
                                    severity: "error",
                                    text: "Failed to refresh session: " + parseError(data),
                                });
                            }
                        });
                    } else {
                        setNotification({
                            open: true,
                            severity: "error",
                            text: parseError(data),
                        });
                    }
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}
