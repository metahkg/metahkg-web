import type { userRole, userSex } from "../user";
export type commentType = {
    /** comment id */
    id: number;
    /** comment user */
    user: {
        id: number;
        name: string;
        sex: userSex;
        role: userRole;
    };
    /** the comment (in stringified html) */
    comment: string;
    /** date string */
    createdAt: string;
    /** shortened link */
    slink?: string;
    /** number of downvotes */
    D?: number;
    /** number of upvotes */
    U?: number;
    /** if this is true, all other keys (except id) doesn't exist! */
    removed?: boolean;
};
