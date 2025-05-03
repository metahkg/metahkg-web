import {
    Autocomplete,
    Box,
    Checkbox,
    Chip,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
} from "@mui/material";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCategories, useNotification } from "../../AppContextProvider";
import { Category } from "@metahkg/api";
import { LoadingButton } from "@mui/lab";
import { Edit } from "@mui/icons-material";
import { api } from "../../../lib/api";
import { cleanObject } from "../../../lib/utils/cleanObject";
import { parseError } from "../../../lib/parseError";
import { memo } from "react";
const EditCategory = memo(function EditCategory() {
    const { t } = useTranslation();
    const formRef = useRef<HTMLFormElement>(null);
    const [categories, setCategories] = useCategories();
    const [, setNotification] = useNotification();
    const [category, setCategory] = useState<number | "">("");
    const [editCat, setEditCat] = useState<Category | null>(null);
    const [loading, setLoading] = useState(false);
    const tags = useMemo<string[]>(
        () => [...new Set(categories.flatMap((cat) => cat.tags || []))],
        [categories]
    );

    const submit = useCallback(
        (e?: React.FormEvent<HTMLFormElement>) => {
            e?.preventDefault();
            if (editCat) {
                setLoading(true);
                api.categoryEdit(editCat.id, cleanObject({ ...editCat, id: undefined }))
                    .then(() => {
                        setLoading(false);
                        setNotification({
                            open: true,
                            severity: "success",
                            text: t("editCategory.category_edited_success"),
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
        [editCat, setCategories, setNotification, t]
    );

    return (
        <Box component="form" ref={formRef} onSubmit={submit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FormControl sx={{ m: 1, minWidth: 150 }}>
                        <InputLabel color="secondary">
                            {t("editCategory.category_label")}
                        </InputLabel>
                        <Select
                            value={category}
                            onChange={(e: SelectChangeEvent<number | "">) => {
                                if (e.target.value === "") {
                                    setCategory("");
                                } else {
                                    setCategory(e.target.value as number);
                                    setEditCat(
                                        categories.find(
                                            (v) => v.id === (e.target.value as number)
                                        ) as Category
                                    );
                                }
                            }}
                            label={t("editCategory.category_label")}
                            color="secondary"
                        >
                            <MenuItem value=""></MenuItem>
                            {categories.map((cat) => (
                                <MenuItem value={cat.id}>{cat.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                {category && editCat && (
                    <React.Fragment>
                        <Grid item xs={6}>
                            <TextField
                                color="secondary"
                                required
                                label={t("editCategory.name_label")}
                                onChange={(e) => {
                                    setEditCat({
                                        ...editCat,
                                        name: e.target.value,
                                    });
                                }}
                                inputProps={{ maxLength: 15 }}
                                fullWidth
                                value={editCat.name}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Autocomplete
                                color="secondary"
                                multiple
                                id="tags-filled"
                                options={tags}
                                freeSolo
                                renderTags={(value: readonly string[], getTagProps) =>
                                    value.map((option: string, index: number) => (
                                        <Chip
                                            variant="outlined"
                                            label={option}
                                            {...getTagProps({ index })}
                                        />
                                    ))
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        color="secondary"
                                        variant="outlined"
                                        label={t("editCategory.tags_label")}
                                    />
                                )}
                                onChange={(_e, v) => {
                                    setEditCat({
                                        ...editCat,
                                        tags: v,
                                    });
                                }}
                                value={editCat.tags || []}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={(e) => {
                                            setEditCat({
                                                ...editCat,
                                                pinned: e.target.checked,
                                            });
                                        }}
                                        color="secondary"
                                        disabled={editCat?.hidden}
                                        checked={!!editCat?.pinned}
                                    />
                                }
                                label={t("editCategory.pinned_label")}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={(e) => {
                                            setEditCat({
                                                ...editCat,
                                                hidden: e.target.checked,
                                            });
                                        }}
                                        color="secondary"
                                        disabled={editCat?.pinned}
                                        checked={!!editCat.hidden}
                                    />
                                }
                                label={t("editCategory.hidden_label")}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={(e) => {
                                            setEditCat({
                                                ...editCat,
                                                nsfw: e.target.checked,
                                            });
                                        }}
                                        color="secondary"
                                        checked={!!editCat.nsfw}
                                    />
                                }
                                label={t("editCategory.nsfw_label")}
                            />
                        </Grid>
                    </React.Fragment>
                )}
            </Grid>
            {category && editCat && (
                <LoadingButton
                    color="secondary"
                    startIcon={<Edit />}
                    type="submit"
                    loading={loading}
                    loadingPosition="start"
                    disabled={!formRef.current?.checkValidity?.() || loading}
                    variant="contained"
                    className="!mt-2"
                >
                    {t("editCategory.edit_button")}
                </LoadingButton>
            )}
        </Box>
    );
});
export default EditCategory;
