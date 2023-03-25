import { useEffect, useState } from "react";
import { api } from "./api";

export interface AvatarProps {
    error: unknown;
    blobUrl: string | undefined;
    loading: boolean;
    reload: () => void;
}

/**
 * Get the avatar of a user.
 * @param id The id of the user.
 */
export function useAvatar(id: number): AvatarProps {
    const [blobUrl, setBlobUrl] = useState<string | undefined>(undefined);
    const [error, setError] = useState<unknown>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [reload, setReload] = useState<boolean>(false);

    useEffect(() => {
        if (id) {
            (async () => {
                try {
                    setLoading(true);
                    const data = await api.userAvatar(id);
                    setBlobUrl(URL.createObjectURL(data.data));
                    setError(null);
                } catch (error) {
                    setError(error);
                    setBlobUrl(undefined);
                } finally {
                    setLoading(false);
                }
            })();
        }
    }, [id, reload]);

    return { error, blobUrl, loading, reload: () => setReload(!reload) };
}
