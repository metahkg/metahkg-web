import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Category } from "@metahkg/api";
import { Box, Drawer, Typography } from "@mui/material";
import { useCategories, useDarkMode, useSettings, useUser } from "./AppContextProvider";
import { useCat, useMenuMode } from "./MenuProvider";
import { Link } from "react-router-dom";
import MetahkgLogo from "./logo";

export function CategoryPanel(props: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const { t } = useTranslation();
    const { open, setOpen } = props;
    const [user] = useUser();
    const [categories] = useCategories();
    const [currentCategory] = useCat();
    const darkMode = useDarkMode();
    const [settings] = useSettings();
    const [menuMode] = useMenuMode();

    const sortedCategories = useMemo(() => {
        const sorted = categories.sort((a, b) => a.id - b.id);
        if (!user) {
            return sorted.filter((category) => !category.hidden);
        }
        return sorted;
    }, [categories, user]);

    const hidden = useMemo(
        () => categories.filter((category) => category.hidden),
        [categories]
    );

    const tags: string[] = useMemo(
        () => [...new Set(sortedCategories.flatMap((category) => category.tags || []))],
        [sortedCategories]
    );

    // hidden categories shall not be pinned
    const pinned = useMemo(
        () => sortedCategories.filter((category) => category.pinned && !category.hidden),
        [sortedCategories]
    );
    const others = useMemo(
        () =>
            sortedCategories
                .filter(
                    (category) =>
                        !category.tags?.length && !category.pinned && !category.hidden
                )
                .concat(hidden.filter((category) => !category.tags?.length)),
        [hidden, sortedCategories]
    );

    const toggleDrawer = useCallback(
        (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
            if (
                event.type === "keydown" &&
                ((event as React.KeyboardEvent).key === "Tab" ||
                    (event as React.KeyboardEvent).key === "Shift")
            ) {
                return;
            }
            setOpen(open);
        },
        [setOpen]
    );

    const CategoryEle = useCallback(
        (category: Category) => (
            <Box
                key={category.id}
                component={Link}
                to={`/category/${category.id}`}
                className="no-underline !text-inherit"
                onClick={toggleDrawer(false)}
            >
                <Typography
                    gutterBottom
                    variant="body2"
                    className={`!my-4`}
                    sx={{
                        color:
                            menuMode === "category" && currentCategory === category.id
                                ? settings.secondaryColor?.main || "#f5bd1f"
                                : "inherit",
                        "&:hover": {
                            color: settings.secondaryColor?.main || "#f5bd1f",
                        },
                    }}
                >
                    {category.name}
                </Typography>
            </Box>
        ),
        [currentCategory, menuMode, settings.secondaryColor?.main, toggleDrawer]
    );

    return (
        <Drawer
            anchor="left"
            PaperProps={{
                sx: {
                    bgcolor: "primary.main",
                },
                className: "!bg-none !left-[50px]",
            }}
            open={open}
            onClose={toggleDrawer(false)}
        >
            <Box className="ml-4 w-[200px] max-w-full" role="presentation">
                <Box className="flex items-end my-5">
                    <MetahkgLogo svg light={darkMode} height={30} width={30} />
                    <Typography variant="h6" component="h1" className="ml-1">
                        {t("categoryPanel.categories_heading")}
                    </Typography>
                </Box>
                <React.Fragment>
                    {Boolean(pinned.length) && (
                        <Box>
                            <Typography className="text-metahkg-grey" gutterBottom>
                                {t("categoryPanel.pinned_heading")}
                            </Typography>
                            {pinned.map(CategoryEle)}
                        </Box>
                    )}
                    {tags.map((tag) => (
                        <Box key={tag}>
                            <Typography gutterBottom className="text-metahkg-grey">
                                {tag}
                            </Typography>
                            {sortedCategories
                                .filter(
                                    (category) =>
                                        category.tags?.includes(tag) && !category.hidden
                                )
                                .concat(
                                    hidden.filter((category) =>
                                        category.tags?.includes(tag)
                                    )
                                )
                                .map(CategoryEle)}
                        </Box>
                    ))}
                    {Boolean(others.length) && (
                        <Box>
                            <Typography gutterBottom className="text-metahkg-grey">
                                {t("categoryPanel.others_heading")}
                            </Typography>
                            {others.map(CategoryEle)}
                        </Box>
                    )}
                </React.Fragment>
            </Box>
        </Drawer>
    );
}
