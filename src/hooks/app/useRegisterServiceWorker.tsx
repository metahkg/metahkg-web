/*
 Copyright (C) 2022-present Wong Chun Yat (wcyat)

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
import { useTranslation } from "react-i18next";
// Registration is now handled by vite-plugin-pwa
// import { register, unregister } from "../../serviceWorkerRegistration";

export function useRegisterServiceWorker() {
    const { t } = useTranslation();
    useEffect(() => {
        // try {
        //     // Unregistering in dev might still be useful if PWA plugin doesn't handle it
        //     // if (import.meta.env.VITE_APP_ENV === "dev") return unregister();
        //
        //     // console.log("registering service worker");
        //
        //     // register({ // Callbacks might need to be adapted for vite-plugin-pwa if custom logic is needed
        //     //     onUpdate: async (registration) => {
        //     //         console.log("service worker updated");
        //     //         window.location.reload();
        //     //     },
        //     //     onSuccess: async (_registration) => {
        //     //         console.log("service worker registered");
        //     //     },
        //     // });
        //
        //     // if ("serviceWorker" in navigator) {
        //     //     navigator.serviceWorker.ready
        //     //         .then(async (registration) => {
        //     //             console.log("updating service worker");
        //     //
        //     //             registration.addEventListener("updatefound", () => {
        //     //                 console.log("update found");
        //     //                 console.log("service worker skip waiting");
        //     //                 registration.waiting?.postMessage({ type: "SKIP_WAITING" });
        //     //                 //window.location.reload();
        //     //             });
        //     //
        //     //             await registration.update();
        //     //
        //     //             setInterval(registration.update, 1000 * 60 * 10);
        //     //         })
        //     //         .catch((error) => {
        //     //             console.error(error.message);
        //     //         });
        //     // }
        // } catch {
        //     console.error(t("app.service_worker_registration_failed"));
        // }
        // NOTE: The update/success logic previously in register() callbacks
        // might need to be reimplemented using vite-plugin-pwa's events if desired.
        // See vite-plugin-pwa documentation for handling updates.
    }, [t]);
}
