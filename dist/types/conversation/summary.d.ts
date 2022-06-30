import { userType } from "../user";
export declare type summary = {
    id: number;
    op: userType;
    c: number;
    vote: number;
    slink?: string;
    title: string;
    category: number;
    lastModified: string;
    createdAt: string;
};
