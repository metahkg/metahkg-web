import { userType } from "../user";
import { commentType } from "./comment";
export declare type threadType = {
    id: number;
    pin?: commentType;
    op: userType;
    c: number;
    vote: number;
    slink?: string;
    title: string;
    category: number;
    lastModified: string;
    createdAt: string;
    conversation: commentType[];
};
