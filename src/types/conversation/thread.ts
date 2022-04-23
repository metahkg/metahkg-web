import { userType } from "../user";
import { commentType } from "./comment";

export type threadType = {
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
