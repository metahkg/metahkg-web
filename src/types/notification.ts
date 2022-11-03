import { severity } from "./severity";

export type notification = { open: boolean; text: string; severity?: severity };

export type RemoteNotification = {
    title: string;
    option: NotificationOptions;
};
