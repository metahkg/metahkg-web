import { Session as APISession } from "@metahkg/api";

export type Session = APISession & {
    /** jwt token, unhashed */
    token: string;
    /** refresh token, unhashed */
    refreshToken: string;
    /** sha256 hash of ip */
    ip: string;
};
