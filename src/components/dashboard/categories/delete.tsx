import {
    Box,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from "@mui/material";
import React, { useCallback, useRef, useState } from "react";
import { useCategories, useNotification } from "../../AppContextProvider";
import { LoadingButton } from "@mui/lab";
import { Delete } from "@mui/icons-material";
import { api } from "../../../lib/api";
import { parseError } from "../../../lib/parseError";
import { memo } from "react";
const DeleteCategory = memo(function DeleteCategory() {
    const formRef = useRef<HTMLFormElement>();
    const [categories, setCategories] = useCategories();
    const [, setNotification] = useNotification();
    const [category, setCategory] = useState<number | "">("");
    const [loading, setLoading] = useState(false);

    const submit = useCallback(
        (e?: React.FormEvent<HTMLFormElement>) => {
            e?.preventDefault();
            if (category) {
                setLoading(true);
                api.categoryDelete(category)
                    .then(() => {
                        setLoading(false);
                        setNotification({
                            open: true,
                            severity: "success",
                            text: "Category deleted successfully.",
                        });
                        api.categories()
                            .then(setCategories)
                            .catch(() => {});
                    })
                    .catch((err) => {
                        setLoading(false);
                        setNotification({
                            open: true,
                            severity: "error",
                            text: parseError(err),
                        });
                    });
            }
        },
        [setCategories, setNotification, category]
    );

    return (
        <Box component="form" ref={formRef} onSubmit={submit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FormControl sx={{ m: 1, minWidth: 150 }}>
                        <InputLabel color="secondary">Category</InputLabel>
                        <Select
                            value={category}
                            onChange={(e: SelectChangeEvent<number | "">) => {
                                if (e.target.value === "") {
                                    setCategory("");
                                } else {
                                    setCategory(e.target.value as number);
                                }
                            }}
                            label="Category"
                            color="secondary"
                        >
                            <MenuItem value=""></MenuItem>
                            {categories.map((cat) => (
                                <MenuItem value={cat.id}>{cat.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {category && (
                    <Grid item xs={12}>
                        <LoadingButton
                            color="error"
                            startIcon={<Delete />}
                            type="submit"
                            loading={loading}
                            loadingPosition="start"
                            disabled={!formRef.current?.checkValidity?.() || loading}
                            variant="contained"
                            className="!mt-2"
                        >
                            Delete
                        </LoadingButton>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
});
export default DeleteCategory;
