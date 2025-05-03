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
import { useTranslation } from "react-i18next";
import { useCategories, useNotification } from "../../AppContextProvider";
import { LoadingButton } from "@mui/lab";
import { Delete } from "@mui/icons-material";
import { api } from "../../../lib/api";
import { parseError } from "../../../lib/parseError";
import { memo } from "react";
const DeleteCategory = memo(function DeleteCategory() {
    const { t } = useTranslation();
    const formRef = useRef<HTMLFormElement>(null);
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
                            text: t("deleteCategory.category_deleted_success"),
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
        [setCategories, setNotification, category, t]
    );

    return (
        <Box component="form" ref={formRef} onSubmit={submit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FormControl sx={{ m: 1, minWidth: 150 }}>
                        <InputLabel color="secondary">
                            {t("deleteCategory.category_label")}
                        </InputLabel>
                        <Select
                            value={category}
                            onChange={(e: SelectChangeEvent<number | "">) => {
                                if (e.target.value === "") {
                                    setCategory("");
                                } else {
                                    setCategory(e.target.value as number);
                                }
                            }}
                            label={t("deleteCategory.category_label")}
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
                            {t("deleteCategory.delete_button")}
                        </LoadingButton>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
});
export default DeleteCategory;
