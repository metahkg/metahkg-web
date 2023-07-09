import {
    Box,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { GuessGame } from "@metahkg/api";
import Loader from "../../../lib/loader";
import { api } from "../../../lib/api";
import { useNotification } from "../../AppContextProvider";
import { LoadingButton } from "@mui/lab";
import { parseError } from "../../../lib/parseError";
import MetahkgLogo from "../../logo";

export default function Game(props: { id: string }) {
    const { id } = props;
    const [game, setGame] = useState<GuessGame | null>(null);
    const [, setNotification] = useNotification();
    const [guess, setGuess] = useState<number | null>(null);
    const [tokens, setTokens] = useState(10);
    const [loading, setLoading] = useState(false);
    const [valid, setValid] = useState(true);
    const [reload, setReload] = useState(false);
    const formRef = useRef<HTMLFormElement>();

    useEffect(() => {
        setGame(null);
        api.games(id)
            .then(setGame)
            .catch((e) => {
                setNotification({
                    open: true,
                    severity: "error",
                    text: parseError(e),
                });
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, reload]);

    return !game ? (
        <Loader position="flex-start" />
    ) : (
        <Box className="transition-[height] ease-out duration-500">
            <Box className="m-3">
                <Typography variant="body1" gutterBottom>
                    {game.title}
                </Typography>
                <RadioGroup
                    color="secondary"
                    onChange={(e) => {
                        setGuess(Number(e.target.value));
                    }}
                >
                    {game.options.map((option, index) => (
                        <FormControlLabel
                            value={index}
                            control={<Radio color="secondary" />}
                            label={
                                <>
                                    <Typography variant="body1">{option.text}</Typography>
                                    <Typography variant="body2">
                                        odds: {Math.round((option.odds || 1) * 100) / 100}
                                    </Typography>
                                </>
                            }
                        />
                    ))}
                </RadioGroup>
                <Typography variant="body2" className="!text-xs !mt-2">
                    Pool: {game.tokens} tokens
                </Typography>
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
                        className="flex mt-3 justify-between items-center"
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
                            startIcon={<MetahkgLogo svg dark height={20} width={20} />}
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
    );
}
