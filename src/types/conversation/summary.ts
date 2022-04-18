import { userSex, userRole } from "../user";

export type summary = {
    c: number;
    id: number;
    op: {
        id: number;
        name: string;
        sex: userSex;
        role: userRole;
    };
    title: string;
    category: number;
    lastModified: string;
    createdAt: string;
    vote: number;
};
