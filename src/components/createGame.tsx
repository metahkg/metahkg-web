import React, { useCallback, useEffect, useState } from "react";
import {
    Box,
    FormControlLabel,
    IconButton,
    Radio,
    RadioGroup,
    TextField,
    Tooltip,
} from "@mui/material";
import { Close, Delete, Done, Edit } from "@mui/icons-material";

export interface GameCreateType {
    type: "guess";
    options: string[];
    title: string;
}

export default function CreateGame(props: {
    type: "guess";
    onChange?: (game: GameCreateType) => void;
}) {
    const { type, onChange } = props;
    const [guessOptions, setGuessOptions] = useState<string[]>([]);
    const [title, setTitle] = useState<string>("");
    const [tempOptions, setTempOptions] = useState<string[]>([]);
    const [newOption, setNewOption] = useState("");
    const [edit, setEdit] = useState<number[]>([]);

    const onSave = useCallback(
        (index: number) => {
            setEdit(edit.filter((e) => e !== index));
            guessOptions[index] = tempOptions[index];
            setGuessOptions([...guessOptions]);
        },
        [edit, guessOptions, tempOptions],
    );

    const onDiscard = useCallback(
        (index: number) => {
            setEdit(edit.filter((e) => e !== index));
            tempOptions[index] = guessOptions[index];
            if (!tempOptions[index]) {
                tempOptions.pop();
            }
            setTempOptions([...tempOptions]);
        },
        [edit, guessOptions, tempOptions],
    );

    useEffect(() => {
        onChange?.({ type, options: guessOptions, title });
    }, [guessOptions, type, onChange, title]);

    return (
        <Box>
            <Box className="flex max-w-full">
                <TextField
                    label="Title"
                    color="secondary"
                    variant="standard"
                    onChange={(e) => {
                        setTitle(e.target.value);
                    }}
                    required
                    fullWidth
                    className="!m-4 !mt-0"
                />
            </Box>
            {type === "guess" && (
                <RadioGroup color="secondary" value={null}>
                    {guessOptions.map((option, index) => (
                        <Box className="flex justify-between !mx-4">
                            <FormControlLabel
                                value={index}
                                control={<Radio color="secondary" />}
                                className="!w-full [&>.MuiFormControlLabel-label]:!w-full whitespace-nowrap"
                                label={
                                    edit.includes(index) ? (
                                        <TextField
                                            type="string"
                                            label="Edit option"
                                            variant="filled"
                                            fullWidth
                                            color="secondary"
                                            defaultValue={guessOptions[index]}
                                            onChange={(e) => {
                                                tempOptions[index] = e.target.value;
                                                setTempOptions([...tempOptions]);
                                            }}
                                        />
                                    ) : (
                                        option
                                    )
                                }
                            />
                            <Box className="flex">
                                {edit.includes(index) ? (
                                    <>
                                        <Tooltip arrow title="Done">
                                            <IconButton
                                                onClick={() => {
                                                    onSave(index);
                                                }}
                                            >
                                                <Done className="!m-2" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip arrow title="Cancel">
                                            <IconButton
                                                onClick={() => {
                                                    onDiscard(index);
                                                }}
                                            >
                                                <Close className="!m-2" />
                                            </IconButton>
                                        </Tooltip>
                                    </>
                                ) : (
                                    <>
                                        <Tooltip arrow title="Edit">
                                            <IconButton
                                                onClick={() => {
                                                    setEdit(edit.concat(index));
                                                }}
                                            >
                                                <Edit className="!m-2" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip arrow title="Delete">
                                            <IconButton
                                                onClick={() => {
                                                    guessOptions.splice(index, 1);
                                                    setGuessOptions([...guessOptions]);
                                                }}
                                            >
                                                <Delete className="!m-2" />
                                            </IconButton>
                                        </Tooltip>
                                    </>
                                )}
                            </Box>
                        </Box>
                    ))}
                    {guessOptions.length < 6 && (
                        <Box className="flex justify-between !mx-4 !my-2">
                            <FormControlLabel
                                control={<Radio color="secondary" />}
                                label={
                                    <TextField
                                        key={guessOptions.length}
                                        type="string"
                                        label="New option"
                                        variant="filled"
                                        fullWidth
                                        color="secondary"
                                        onChange={(e) => {
                                            tempOptions[guessOptions.length] =
                                                e.target.value;
                                            setTempOptions([...tempOptions]);
                                            setNewOption(e.target.value);
                                        }}
                                        className="!w-full"
                                    />
                                }
                                className="!w-full [&>.MuiFormControlLabel-label]:!w-full"
                            />
                            <IconButton
                                onClick={() => {
                                    onSave(guessOptions.length);
                                    setNewOption("");
                                }}
                                disabled={!newOption}
                            >
                                <Done className="!mx-2" />
                            </IconButton>
                        </Box>
                    )}
                </RadioGroup>
            )}
        </Box>
    );
}
