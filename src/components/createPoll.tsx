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
import { memo } from "react";

export interface PollCreateType {
    options: string[];
    title: string;
}
const CreatePoll = memo(function CreatePoll(props: {
    onChange?: (poll: PollCreateType) => void;
}) {
    const { onChange } = props;
    const [pollOptions, setPollOptions] = useState<string[]>([]);
    const [title, setTitle] = useState<string>("");
    const [tempOptions, setTempOptions] = useState<string[]>([]);
    const [newOption, setNewOption] = useState("");
    const [edit, setEdit] = useState<number[]>([]);

    const onSave = useCallback(
        (index: number) => {
            setEdit(edit.filter((e) => e !== index));
            pollOptions[index] = tempOptions[index];
            setPollOptions([...pollOptions]);
        },
        [edit, pollOptions, tempOptions]
    );

    const onDiscard = useCallback(
        (index: number) => {
            setEdit(edit.filter((e) => e !== index));
            tempOptions[index] = pollOptions[index];
            if (!tempOptions[index]) {
                tempOptions.pop();
            }
            setTempOptions([...tempOptions]);
        },
        [edit, pollOptions, tempOptions]
    );

    const handleKeyPress = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                if (edit.length > 0) {
                    onSave(edit[0]);
                } else if (newOption) {
                    onSave(pollOptions.length);
                    setNewOption("");
                } else {
                    onChange?.({ options: pollOptions, title });
                }
            }
        },
        [edit, pollOptions, newOption, onChange, onSave, title]
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKeyPress);
        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [handleKeyPress]);

    useEffect(() => {
        onChange?.({ options: pollOptions, title });
    }, [pollOptions, onChange, title]);

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
                    fullWidth
                    className="!m-4 !mt-0"
                />
            </Box>

            <RadioGroup color="secondary" value={null}>
                {pollOptions.map((option, index) => (
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
                                        defaultValue={pollOptions[index]}
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
                                                pollOptions.splice(index, 1);
                                                setPollOptions([...pollOptions]);
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
                {pollOptions.length < 6 && (
                    <Box className="flex justify-between !mx-4 !my-2">
                        <FormControlLabel
                            control={<Radio color="secondary" />}
                            label={
                                <TextField
                                    key={pollOptions.length}
                                    type="string"
                                    label="New option"
                                    variant="filled"
                                    fullWidth
                                    color="secondary"
                                    onChange={(e) => {
                                        tempOptions[pollOptions.length] = e.target.value;
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
                                onSave(pollOptions.length);
                                setNewOption("");
                            }}
                            disabled={!newOption}
                        >
                            <Done className="!mx-2" />
                        </IconButton>
                    </Box>
                )}
            </RadioGroup>
        </Box>
    );
});
export default CreatePoll;
