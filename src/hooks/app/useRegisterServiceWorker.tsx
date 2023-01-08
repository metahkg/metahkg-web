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

import { useEffect } from "react";
import { register, unregister } from "../../serviceWorkerRegistration";

export function useRegisterServiceWorker() {
    useEffect(() => {
        try {
            if (process.env.REACT_APP_ENV === "dev") return unregister();

            console.log("registering service worker");

            register({
                onUpdate: async (registration) => {
                    registration.waiting?.postMessage({ type: "SKIP_WAITING" });
                    window.location.reload();
                },
                onSuccess: async (_registration) => {
                    console.log("service worker registered");
                },
            });

            if ("serviceWorker" in navigator) {
                navigator.serviceWorker.ready
                    .then(async (registration) => {
                        console.log("updating service worker");

                        await registration.update();

                        registration.addEventListener("updatefound", () => {
                            console.log("update found");
                            console.log("service worker skip waiting");
                            registration.waiting?.postMessage({ type: "SKIP_WAITING" });
                            window.location.reload();
                        });

                        setInterval(registration.update, 1000 * 60 * 10);

                        if (registration.waiting) {
                            registration.waiting?.postMessage({ type: "SKIP_WAITING" });
                            window.location.reload();
                        }
                    })
                    .catch((error) => {
                        console.error(error.message);
                    });
            }
        } catch {
            console.error("Service worker registration failed");
        }
    }, []);
}
