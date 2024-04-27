import { Box, FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { Poll, UserVote } from "@metahkg/api";
import Loader from "../../../lib/loader";
import { api } from "../../../lib/api";
import { useIsSmallScreen, useNotification, useUser } from "../../AppContextProvider";
import { LoadingButton } from "@mui/lab";
import { parseError } from "../../../lib/parseError";
import { HowToVote, Poll as PollIcon } from "@mui/icons-material";
import { wholePath } from "../../../lib/common";
import { useNavigate } from "react-router-dom";
import { useComment } from "../comment";

export default function PollComponent(props: { id: string }) {
    const { id } = props;
    const [poll, setPoll] = useState<Poll | null>(null);
    const [, setNotification] = useNotification();
    const [vote, setVote] = useState<number | null>(null);
    const [meVote, setMeVote] = useState<UserVote | null>(null);
    const [loading, setLoading] = useState(false);
    const [reload, setReload] = useState(false);
    const [user] = useUser();
    const formRef = useRef<HTMLFormElement>();
    const navigate = useNavigate();
    const [comment] = useComment();
    const isSmallScreen = useIsSmallScreen();
    const pollEnded = useMemo(
        () =>
            poll && poll.endsAt && new Date(poll.endsAt).getTime() < new Date().getTime(),
        [poll]
    );

    useEffect(() => {
        api.pollsInfo(id)
            .then((poll) => {
                setPoll(poll);
                setVote(null);
            })
            .catch((e) => {
                setNotification({
                    open: true,
                    severity: "error",
                    text: parseError(e),
                });
            });
    }, [id, reload, setNotification]);

    useEffect(() => {
        api.meVotesPolls(id)
            .then((data) => {
                setMeVote(data);
            })
            .catch((e) => {
                if (e?.statusCode === 404) {
                    setMeVote(null);
                } else {
                    setNotification({
                        open: true,
                        severity: "error",
                        text: parseError(e),
                    });
                }
            });
    }, [id, setNotification, reload, user]);

    return !poll ? (
        <Loader position="flex-start" />
    ) : (
        <Box>
            <Box className="m-3 p-3">
                <Box className="flex mb-1 align-bottom">
                    <PollIcon
                        className="mr-2"
                        sx={{ color: "secondary.main", fontSize: "32px" }}
                    />
                    <Typography
                        variant="h5"
                        className="inline-block !m-0 !p-0 h-5"
                        color="secondary.main"
                    >
                        {poll.title}
                    </Typography>
                </Box>
                <RadioGroup
                    color="secondary"
                    onChange={(e) => {
                        if (meVote === null) setVote(Number(e.target.value));
                    }}
                    value={meVote?.option ?? vote}
                    className="transition-[height] ease-out duration-500"
                >
                    {poll.options.map((option, index) => (
                        <Box className="flex justify-between items-center !w-full">
                            <FormControlLabel
                                key={index}
                                value={index}
                                control={<Radio color="secondary" />}
                                className="rounded-md p-2 m-1"
                                sx={{
                                    width: `${
                                        ((option?.votes || 0) /
                                            (poll.options.reduce(
                                                (prev, curr) => prev + curr.votes,
                                                0
                                            ) || 1)) *
                                        100
                                    }%`,
                                    minWidth: 0,
                                    backgroundColor: "secondary.dark",
                                }}
                                label={
                                    <Box className={` whitespace-nowrap`}>
                                        <Typography variant="body1">
                                            {option.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            className="flex items-center"
                                        >
                                            {option.votes || 0} vote
                                            {option.votes === 1 ? "" : "s"}
                                        </Typography>
                                    </Box>
                                }
                            />
                        </Box>
                    ))}
                </RadioGroup>

                {!pollEnded && !meVote && (
                    <Box className="transition-[height] ease-out duration-500">
                        <Box
                            component="form"
                            onSubmit={(e) => {
                                e?.preventDefault();
                                if (!user) {
                                    return navigate(
                                        `/users/login?continue=true&returnto=${encodeURIComponent(
                                            `${wholePath()}&c=${comment.id}`
                                        )}`
                                    );
                                }

                                if (vote !== null) {
                                    setLoading(true);
                                    api.pollsVote(id, {
                                        option: vote,
                                    })
                                        .then(() => {
                                            setVote(null);
                                            setLoading(false);
                                            setReload(!reload);
                                        })
                                        .catch((e) => {
                                            setLoading(false);
                                            setNotification({
                                                open: true,
                                                severity: "error",
                                                text: parseError(e),
                                            });
                                        });
                                }
                            }}
                            ref={formRef}
                            className={`${
                                isSmallScreen ? "" : "flex justify-between items-center"
                            } mt-3 transition-[height] ease-out duration-500`}
                        >
                            <LoadingButton
                                type="submit"
                                startIcon={<HowToVote height={20} width={20} />}
                                disabled={vote === null}
                                loading={loading}
                                loadingPosition="start"
                                color="secondary"
                                variant="contained"
                                className={isSmallScreen ? "!mt-3" : ""}
                            >
                                Vote
                            </LoadingButton>
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
}
