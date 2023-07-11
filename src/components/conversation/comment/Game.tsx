import {
    Box,
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
import { useDarkMode, useNotification, useUser } from "../../AppContextProvider";
import { LoadingButton } from "@mui/lab";
import { parseError } from "../../../lib/parseError";
import MetahkgLogo from "../../logo";
import { Pool } from "@mui/icons-material";

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
    const darkMode = useDarkMode();
    const formRef = useRef<HTMLFormElement>();

    useEffect(() => {
        api.game(id)
            .then(setGame)
            .catch((e) => {
                setNotification({
                    open: true,
                    severity: "error",
                    text: parseError(e),
                });
            });
    }, [id, reload, setNotification]);

    useEffect(() => {
        if (game?.type === "guess") {
            api.meGamesGuess(id)
                .then((data) => {
                    setMeGuessHistory(data);
                    const lastBet = data[data.length - 1]?.option;
                    if (lastBet || lastBet === 0) {
                        setGuess(lastBet);
                    }
                })
                .catch((e) => {
                    setNotification({
                        open: true,
                        severity: "error",
                        text: parseError(e),
                    });
                });
        }
    }, [game?.type, id, setNotification, reload]);

    return !game || (game?.type === "guess" && !meGuessHistory) ? (
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
                        if (user?.id === game.host.id) return;
                        setGuess(Number(e.target.value));
                    }}
                    value={user?.id === game.host.id ? null : guess}
                    className="transition-[height] ease-out duration-500"
                >
                    {game.options.map((option, index) => (
                        <Box className="flex justify-between items-center">
                            <FormControlLabel
                                key={index}
                                value={index}
                                control={<Radio color="secondary" />}
                                label={
                                    <Box
                                        className={`rounded-md p-2 m-1 ${
                                            meGuessHistory?.[meGuessHistory?.length - 1]
                                                ?.option === index
                                                ? "bg-gray-300 dark:bg-blue-900"
                                                : "bg-gray-100 dark:bg-gray-800"
                                        }`}
                                        style={{
                                            width: `${(option?.odds || 1) * 100}%`,
                                        }}
                                    >
                                        <Typography variant="body1">
                                            {option.text}
                                        </Typography>
                                        <Typography variant="body2">
                                            odds:{" "}
                                            {Math.round((option.odds || 1) * 100) / 100}
                                        </Typography>
                                    </Box>
                                }
                            />
                            {meGuessHistory?.[meGuessHistory?.length - 1]?.option ===
                                index && (
                                <Typography variant="body1">
                                    You bet:{" "}
                                    {meGuessHistory?.[meGuessHistory?.length - 1]?.tokens}{" "}
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
                    {guess !== null && (
                        <Box
                            component="form"
                            onSubmit={(e) => {
                                e?.preventDefault();
                                if (guess !== null) {
                                    setLoading(true);
                                    api.gamesGuessGuess(id, {
                                        tokens,
                                        option: guess,
                                    })
                                        .then(() => {
                                            setGuess(null);
                                            setTokens(10);
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
                            className="flex mt-3 justify-between items-center transition-[height] ease-out duration-500"
                        >
                            <TextField
                                type="number"
                                color="secondary"
                                inputProps={{ pattern: "^[1-9]\\d*" }}
                                label="Tokens"
                                onChange={(e) => {
                                    setTokens(Number(e.target.value));
                                    setValid(formRef.current?.checkValidity() ?? false);
                                }}
                                defaultValue={tokens}
                                variant="outlined"
                            />
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
                            >
                                Bet
                            </LoadingButton>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
