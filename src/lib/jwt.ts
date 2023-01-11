import { User } from "@metahkg/api";
import * as jose from "jose";

export function loadUser(token?: string): User | null {
    if (!token) return null;

    try {
        return jose.decodeJwt(token) as unknown as User | null;
    } catch (err) {
        console.error(err);
        return null;
    }
}

// currently not supported (DOMexception)
/*export async function verifyToken(
    token: string,
    serverPublicKey: string
): Promise<boolean | null> {
    try {
        const publicKey = await jose.importSPKI(serverPublicKey, "EdDSA");
        await jose.jwtVerify(token, publicKey);
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}*/
