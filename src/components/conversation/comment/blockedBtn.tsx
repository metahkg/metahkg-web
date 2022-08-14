import { Button, Tooltip } from "@mui/material";

export default function BlockedBtn(props: {
    userName: string;
    reason?: string;
    setBlocked?: (x?: boolean) => void;
    className?: string;
}) {
    const { userName, reason, setBlocked, className } = props;

    return (
        <Tooltip
            arrow
            title={`User ${userName} blocked${reason ? ` because of "${reason}"` : ""}.`}
        >
            <Button
                className={`${className} !text-[14px] !normal-case`}
                color="error"
                onClick={() => {
                    setBlocked?.(false);
                }}
                variant="outlined"
            >
                Click to view comment
            </Button>
        </Tooltip>
    );
}
