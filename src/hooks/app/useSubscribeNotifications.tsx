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
import {useUser} from "../../components/AppContextProvider";
import { api } from "../../lib/api";
import { checkNotificationPromise } from "../../lib/checkNotificationPromise";

export function useSubscribeNotifications() {
    const [user] = useUser();
    useEffect(() => {
        // some browsers (like ios safari does not support Notification)
        // some code from https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API
        if (!("Notification" in window)) {
            return console.log("This browser does not support notifications.");
        }
        if (user) {
            console.log("request notification permission");

            function handlePermission(status: NotificationPermission) {
                console.log("notification permission", status);
                if ("serviceWorker" in navigator) {
                    navigator.serviceWorker.ready.then(async (registration) => {
                        if (await registration.pushManager.getSubscription()) return;
                        console.log("subscribe");
                        const subscription = await registration.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY,
                        });
                        const auth = subscription.toJSON().keys?.auth;
                        const p256dh = subscription.toJSON().keys?.p256dh;

                        if (auth && p256dh) {
                            await api.meNotificationsSubscribe({
                                endpoint: subscription.endpoint,
                                keys: {
                                    auth,
                                    p256dh,
                                },
                            });
                        }
                    });
                }
            }

            // check notification promise for compatibility
            if (checkNotificationPromise()) {
                Notification.requestPermission()
                    .then(handlePermission)
                    .catch(console.log);
            } else {
                Notification.requestPermission(handlePermission);
            }
        }
    }, [user]);
}