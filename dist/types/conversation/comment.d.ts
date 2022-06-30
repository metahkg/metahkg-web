import type { userType } from "../user";
export declare type commentType = {
    /** comment id */
    id: number;
    /** comment user */
    user: userType;
    /** the comment (in stringified html) */
    comment: string;
    /** the comment converted to plain text */
    text: string;
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
    quote?: commentType;
    replies?: number[];
};
