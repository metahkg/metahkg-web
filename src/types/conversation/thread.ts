import { userRole, userSex } from "../user";
import { commentType } from "./comment";

export type threadType = {
    id: number;
    op: {
        id: number;
        name: string;
        sex: userSex;
        role: userRole;
    };
    c: number;
    vote: number;
    slink?: string;
    title: string;
    category: number;
    lastModified: string;
    createdAt: string;
    conversation: commentType[];
};
