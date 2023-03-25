import React, { useImperativeHandle } from "react";
import { Avatar, Skeleton, SxProps, Theme } from "@mui/material";
import { AvatarProps, useAvatar } from "./useAvatar";
import { generateRandomColor } from "../lib/randomColor";

const UserAvatar = React.forwardRef(
    (
        props: {
            user: { id: number; name: string };
            className?: string;
            avatar?: AvatarProps;
            sx?: SxProps<Theme>;
        },
        ref: React.ForwardedRef<AvatarProps>
    ) => {
        const { user, className, sx } = props;

        let avatar = useAvatar(props.avatar ? 0 : user.id);
        if (props.avatar) {
            avatar = props.avatar;
        }

        const { reload, error, blobUrl, loading } = avatar;

        useImperativeHandle(ref, () => ({
            reload,
            error,
            blobUrl,
            loading,
        }));

        return loading ? (
            <Skeleton
                sx={{ ...{ height: "100%", width: "100%" }, ...sx }}
                variant="circular"
                animation="wave"
            />
        ) : (
            <Avatar
                src={blobUrl}
                className={className}
                alt={user.name}
                sx={{ ...{ bgcolor: generateRandomColor(user.name) }, ...sx }}
            />
        );
    }
);

export default UserAvatar;
