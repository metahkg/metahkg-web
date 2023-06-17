import React, { useImperativeHandle, useMemo } from "react";
import {
    Avatar,
    Badge,
    Box,
    IconButton,
    Skeleton,
    SxProps,
    Theme,
    Tooltip,
} from "@mui/material";
import { AvatarProps, useAvatar } from "../hooks/useAvatar";
import { generateRandomColor } from "../lib/randomColor";

export function avatarName(name: string) {
    return name
        .split(" ")
        .map((word) => word[0])
        .join("");
}

const UserAvatar = React.forwardRef(
    (
        props: {
            user: { id: number; name: string };
            className?: string;
            avatar?: AvatarProps;
            sx?: SxProps<Theme>;
            buttons?: {
                onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
                icon: React.ReactNode;
                label?: React.ReactNode;
            }[];
            customButtons?: React.ReactNode[];
        },
        ref: React.ForwardedRef<AvatarProps>
    ) => {
        const { user, className, sx, buttons, customButtons } = props;

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

        const avatarComponent = useMemo(
            () => (
                <Avatar
                    src={blobUrl}
                    className={className}
                    alt={user.name}
                    sx={{ ...{ bgcolor: generateRandomColor(user.name) }, ...sx }}
                >
                    {avatarName(user.name)}
                </Avatar>
            ),
            [blobUrl, className, sx, user.name]
        );

        return loading ? (
            <Skeleton
                sx={{ ...{ height: "100%", width: "100%" }, ...sx }}
                variant="circular"
                animation="wave"
            />
        ) : buttons?.length || customButtons?.length ? (
            <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                    <Box className="flex flex-wrap gap-x-1 items-end">
                        {customButtons}
                        {buttons &&
                            buttons.map(({ icon, label, onClick }) => (
                                <Tooltip title={label} arrow>
                                    <IconButton
                                        onClick={onClick}
                                        sx={{
                                            bgcolor: "primary.main",
                                            "&:hover": { bgcolor: "primary.main" },
                                        }}
                                    >
                                        {icon}
                                    </IconButton>
                                </Tooltip>
                            ))}
                    </Box>
                }
            >
                {avatarComponent}
            </Badge>
        ) : (
            avatarComponent
        );
    }
);

export default UserAvatar;
