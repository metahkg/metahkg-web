import { api } from "./api";
import { checkNotificationPromise } from "./checkNotificationPromise";

export function subscribe() {
    // some browsers (like ios safari does not support Notification)
    // some code from https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API
    if (!("Notification" in window)) {
        return console.log("This browser does not support notifications.");
    }

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
                    await api
                        .meNotificationsSubscribe({
                            endpoint: subscription.endpoint,
                            keys: {
                                auth,
                                p256dh,
                            },
                        })
                        .catch(console.error);
                }
            });
        }
    }

    console.log("request notification permission");
    // check notification promise for compatibility
    if (checkNotificationPromise()) {
        Notification.requestPermission().then(handlePermission).catch(console.log);
    } else {
        Notification.requestPermission(handlePermission);
    }
}

export function unsubscribe() {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready.then(async (registration) => {
            if (!(await registration.pushManager.getSubscription())) return;
            console.log("unsubscribe");
            await api.meNotificationsUnsubscribe().catch(console.error);
            await registration.pushManager.getSubscription().then((subscription) => {
                subscription?.unsubscribe();
            });
        });
    }
}
