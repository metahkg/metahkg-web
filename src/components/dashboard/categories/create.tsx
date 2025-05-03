import { Create } from "@mui/icons-material";
import {
    Autocomplete,
    Box,
    Checkbox,
    Chip,
    FormControlLabel,
    Grid,
    TextField,
} from "@mui/material";
import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCategories, useNotification } from "../../AppContextProvider";
import { LoadingButton } from "@mui/lab";
import { api } from "../../../lib/api";
import { parseError } from "../../../lib/parseError";
import { memo } from "react";
const CreateCategory = memo(function CreateCategory() {
    const { t } = useTranslation();
    const [, setNotification] = useNotification();
    const [categories, setCategories] = useCategories();
    const tags = useMemo<string[]>(
        () => [...new Set(categories.flatMap((cat) => cat.tags || []))],
        [categories]
    );
    const [createSettings, setCreateSettings] = useState<{
        name: string;
        tags?: string[];
        pinned?: boolean;
        hidden?: boolean;
        nsfw?: boolean;
    } | null>(null);
    const createFormRef = useRef<HTMLFormElement>(null);
    const [createLoading, setCreateLoading] = useState(false);
    const createSubmit = useCallback(
        (e?: React.FormEvent<HTMLFormElement>) => {
            e?.preventDefault();
            if (createSettings && createSettings.name) {
                setCreateLoading(true);
                api.categoryCreate(createSettings)
                    .then(() => {
                        setCreateLoading(false);
                        setNotification({
                            open: true,
                            severity: "success",
                            text: t("createCategory.category_created_success"),
                        });
                        api.categories()
                            .then(setCategories)
                            .catch(() => {});
                    })
                    .catch((err) => {
                        setCreateLoading(false);
                        setNotification({
                            open: true,
                            severity: "error",
                            text: parseError(err),
                        });
                    });
            }
        },
        [createSettings, setCategories, setNotification, t]
    );

    return (
        <Box onSubmit={createSubmit} component="form" ref={createFormRef}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField
                        color="secondary"
                        required
                        label={t("createCategory.name_label")}
                        onChange={(e) => {
                            setCreateSettings({
                                ...createSettings,
                                name: e.target.value,
                            });
                        }}
                        inputProps={{ maxLength: 15 }}
                        fullWidth
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
                                label={t("createCategory.tags_label")}
                            />
                        )}
                        onChange={(_e, v) => {
                            setCreateSettings({
                                name: "",
                                ...createSettings,
                                tags: v,
                            });
                        }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                onChange={(e) => {
                                    setCreateSettings({
                                        name: "",
                                        ...createSettings,
                                        pinned: e.target.checked,
                                    });
                                }}
                                color="secondary"
                                disabled={createSettings?.hidden}
                            />
                        }
                        label={t("createCategory.pinned_label")}
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                onChange={(e) => {
                                    setCreateSettings({
                                        name: "",
                                        ...createSettings,
                                        hidden: e.target.checked,
                                    });
                                }}
                                color="secondary"
                                disabled={createSettings?.pinned}
                            />
                        }
                        label={t("createCategory.hidden_label")}
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                onChange={(e) => {
                                    setCreateSettings({
                                        name: "",
                                        ...createSettings,
                                        nsfw: e.target.checked,
                                    });
                                }}
                                color="secondary"
                            />
                        }
                        label={t("createCategory.nsfw_label")}
                    />
                </Grid>
            </Grid>
            <LoadingButton
                color="secondary"
                startIcon={<Create />}
                type="submit"
                loading={createLoading}
                loadingPosition="start"
                disabled={!createFormRef.current?.checkValidity?.() || createLoading}
                variant="contained"
                className="!mt-2"
            >
                {t("createCategory.create_button")}
            </LoadingButton>
        </Box>
    );
});
export default CreateCategory;
