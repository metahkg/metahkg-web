import React from "react";
import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from "@mui/material";
import { useCategories } from "../AppContextProvider";

/**
 * It takes in a category number and a setter function for the category number, and returns a form
 * control with a select menu that allows the user to choose a category
 * @param {number} props.cat The currently choosed category
 * @param {React.Dispatch<React.SetStateAction<number>>} props.setCat The function to update props.cat
 * @returns A form control with a select menu.
 */
export default function ChooseCat(props: {
    cat: number;
    setCat: React.Dispatch<React.SetStateAction<number>>;
}) {
    const { cat, setCat } = props;
    const changeHandler = (e: SelectChangeEvent<number>) => {
        setCat(Number(e.target.value));
    };
    const categories = useCategories();
    return (
        <Box>
            {categories.length && (
                <FormControl className="!min-w-[200px]">
                    <InputLabel color="secondary">Category</InputLabel>
                    <Select
                        color="secondary"
                        value={cat}
                        label="Category"
                        onChange={changeHandler}
                    >
                        {categories.map((category) => (
                            <MenuItem value={category.id}>{category.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
        </Box>
    );
}
