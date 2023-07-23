import {
    Box,
    Checkbox,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { GuessGame, UserGuess } from "@metahkg/api";
import Loader from "../../../lib/loader";
import { api } from "../../../lib/api";
import {
    useDarkMode,
    useIsSmallScreen,
    useNotification,
    useUser,
    useUserProfile,
} from "../../AppContextProvider";
import { LoadingButton } from "@mui/lab";
import { parseError } from "../../../lib/parseError";
import MetahkgLogo from "../../logo";
import { Casino, CheckCircle, ClearRounded, Pool } from "@mui/icons-material";
import { wholePath } from "../../../lib/common";
import { useNavigate } from "react-router-dom";
import { useComment } from "../comment";

export default function Game(props: { id: string }) {
    const { id } = props;
    const [game, setGame] = useState<GuessGame | null>(null);
    const [, setNotification] = useNotification();
    const [guess, setGuess] = useState<number | null>(null);
    const [meGuessHistory, setMeGuessHistory] = useState<UserGuess[] | null>(null);
    const [tokens, setTokens] = useState(10);
    const [loading, setLoading] = useState(false);
    const [valid, setValid] = useState(true);
    const [reload, setReload] = useState(false);
    const [user] = useUser();
    const [userProfile, setUserProfile] = useUserProfile();
    const darkMode = useDarkMode();
    const formRef = useRef<HTMLFormElement>();
    const navigate = useNavigate();
    const [comment] = useComment();
    const [answer, setAnswer] = useState<number[]>([]);
    const isSmallScreen = useIsSmallScreen();
    const isHost = (user?.id && game?.host.id && user.id === game.host.id) ?? false;

    useEffect(() => {
        api.game(id)
            .then((game) => {
                setGame(game);
                setGuess(null);
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
        if (game?.type === "guess" && user) {
            api.meGamesGuess(id)
                .then((data) => {
                    setMeGuessHistory(data);
                })
                .catch((e) => {
                    setNotification({
                        open: true,
                        severity: "error",
                        text: parseError(e),
                    });
                });
        }
    }, [game?.type, id, setNotification, reload, user]);

    useEffect(() => {
        if (isHost) {
            if (answer.length >= 1) {
                setValid(true);
            } else {
                setValid(false);
            }
        }
    }, [isHost, answer]);

    return !game || (game?.type === "guess" && user && !meGuessHistory) ? (
        <Loader position="flex-start" />
    ) : (
        <Box className="rounded-2xl dark:bg-gray-900">
            <Box className="m-3 p-3">
                <Typography variant="body1" gutterBottom>
                    {game.title}
                </Typography>
                <RadioGroup
                    color="secondary"
                    onChange={(e) => {
                        if (isHost || game.endedAt) return;
                        setGuess(Number(e.target.value));
                    }}
                    value={guess}
                    className="transition-[height] ease-out duration-500"
                >
                    {game.options.map((option, index) => (
                        <Box className="flex justify-between items-center">
                            <FormControlLabel
                                key={index}
                                value={index}
                                control={
                                    isHost && !game.endedAt ? (
                                        <Checkbox
                                            checked={answer.includes(index)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    answer.push(index);
                                                    setAnswer([...answer]);
                                                } else {
                                                    setAnswer(
                                                        answer.filter((v) => v !== index)
                                                    );
                                                }
                                            }}
                                            color="secondary"
                                        />
                                    ) : game.endedAt ? (
                                        game.answer?.includes(index) ? (
                                            <CheckCircle
                                                color="success"
                                                className="mx-2"
                                            />
                                        ) : (
                                            <ClearRounded
                                                color="error"
                                                className="mx-2"
                                            />
                                        )
                                    ) : (
                                        <Radio color="secondary" />
                                    )
                                }
                                label={
                                    <Box
                                        className={`rounded-md p-2 m-1 whitespace-nowrap ${
                                            game.endedAt
                                                ? game.answer?.includes(index)
                                                    ? "bg-green-600 dark:bg-green-900"
                                                    : "bg-red-600 dark:bg-red-900"
                                                : meGuessHistory?.find(
                                                      (v) => v.option === index
                                                  )
                                                ? "bg-gray-300 dark:bg-blue-900"
                                                : "bg-gray-100 dark:bg-gray-800"
                                        }`}
                                        style={{
                                            ...(!(isHost && !game.endedAt) && {
                                                width: `${
                                                    ((option?.tokens || 0) /
                                                        (game.tokens || 0)) *
                                                    500
                                                }%`,
                                            }),
                                            minWidth: "50px",
                                        }}
                                    >
                                        <Typography variant="body1">
                                            {option.text}
                                        </Typography>
                                        {!(isHost && !game.endedAt) && (
                                            <Typography
                                                variant="body2"
                                                className="flex items-center"
                                            >
                                                <Casino className="!text-[15px] mx-1" />{" "}
                                                {Math.round((option.odds || 1) * 100) /
                                                    100}{" "}
                                                <MetahkgLogo
                                                    width={13}
                                                    height={13}
                                                    light={darkMode}
                                                    svg
                                                    className="mx-1"
                                                />{" "}
                                                {option.tokens || 0}
                                            </Typography>
                                        )}
                                    </Box>
                                }
                            />
                            {(meGuessHistory?.filter((v) => v.option === index)?.length ||
                                false) && (
                                <Typography variant="body1">
                                    Your bet:{" "}
                                    {meGuessHistory
                                        .filter((v) => v.option === index)
                                        .reduce(
                                            (prev, curr) => prev + curr.tokens,
                                            0
                                        )}{" "}
                                    <MetahkgLogo
                                        svg
                                        light={darkMode}
                                        height={16}
                                        width={16}
                                    />
                                </Typography>
                            )}
                        </Box>
                    ))}
                </RadioGroup>
                <Typography variant="body2" className="!text-sm !mt-2 flex items-center">
                    <Pool className="!text-sm" />: {game.tokens || 0}{" "}
                    <MetahkgLogo
                        className="ml-1"
                        svg
                        light={darkMode}
                        height={14}
                        width={14}
                    />
                </Typography>
                <Box className="transition-[height] ease-out duration-500">
                    {(isHost || guess !== null) && !game.endedAt && (
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
                                if (isHost) {
                                    setLoading(true);
                                    return api
                                        .gamesGuessAnswer(id, {
                                            answer: answer as unknown as number,
                                        })
                                        .then(() => {
                                            setLoading(false);
                                            setReload(!reload);
                                            setNotification({
                                                open: true,
                                                severity: "success",
                                                text: "Game answer set.",
                                            });
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
                                if (guess !== null) {
                                    setLoading(true);
                                    api.gamesGuessGuess(id, {
                                        tokens,
                                        option: guess,
                                    })
                                        .then(() => {
                                            setGuess(null);
                                            setLoading(false);
                                            setReload(!reload);
                                            setUserProfile({
                                                ...userProfile,
                                                games: {
                                                    ...userProfile.games,
                                                    tokens:
                                                        (userProfile.games?.tokens || 0) -
                                                        tokens,
                                                },
                                            });
                                            setNotification({
                                                open: true,
                                                severity: "success",
                                                text: `You bet ${tokens} tokens!`,
                                            });
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
                            {!isHost && (
                                <Box className="flex items-center">
                                    <TextField
                                        type="number"
                                        color="secondary"
                                        inputProps={{ pattern: "^[1-9]\\d*" }}
                                        label="Tokens"
                                        onChange={(e) => {
                                            setTokens(Number(e.target.value));
                                            setValid(
                                                formRef.current?.checkValidity() ?? false
                                            );
                                        }}
                                        defaultValue={tokens}
                                        variant="outlined"
                                    />
                                    {typeof userProfile.games?.tokens === "number" && (
                                        <Typography variant="body1" className="!ml-4">
                                            You have: {userProfile.games.tokens}{" "}
                                            <MetahkgLogo
                                                light={darkMode}
                                                svg
                                                height={14}
                                                width={14}
                                            />
                                        </Typography>
                                    )}
                                </Box>
                            )}
                            <LoadingButton
                                type="submit"
                                startIcon={
                                    <MetahkgLogo svg dark height={20} width={20} />
                                }
                                disabled={!valid}
                                loading={loading}
                                loadingPosition="start"
                                color="secondary"
                                variant="contained"
                                className={isSmallScreen ? "!mt-3" : ""}
                            >
                                {isHost ? "Set answer" : "Bet"}
                            </LoadingButton>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
