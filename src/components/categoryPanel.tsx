import React, { useCallback } from "react";
import { Category } from "@metahkg/api";
import { Box, Drawer, Typography } from "@mui/material";
import { useCategories, useUser } from "./AppContextProvider";
import { useCat } from "./MenuProvider";
import { Link } from "react-router-dom";
import MetahkgLogo from "./logo";

export function CategoryPanel(props: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const { open, setOpen } = props;
    const [user] = useUser();
    let [categories] = useCategories();
    const [currentCategory] = useCat();

    categories.sort((a, b) => a.id - b.id);

    const hidden = categories.filter((category) => category.hidden);

    if (!user) {
        categories = categories.filter((category) => !category.hidden);
    }

    const tags: string[] = categories.reduce((prev, curr) => {
        curr.tags?.forEach((tag) => {
            if (!prev.includes(tag)) {
                prev.push(tag);
            }
        });
        return prev;
    }, [] as string[]);

    // hidden categories shall not be pinned
    const pinned = categories.filter((category) => category.pinned && !category.hidden);
    const others = categories
        .filter(
            (category) => !category.tags?.length && !category.pinned && !category.hidden
        )
        .concat(hidden.filter((category) => !category.tags?.length));

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
                    className={`${
                        currentCategory === category.id
                            ? "text-metahkg-yellow"
                            : "text-inherit"
                    } hover:text-metahkg-yellow !my-4`}
                >
                    {category.name}
                </Typography>
            </Box>
        ),
        [currentCategory, toggleDrawer]
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
                    <MetahkgLogo svg light height={30} width={30} />
                    <Typography variant="h6" component="h1" className="ml-1">
                        Categories
                    </Typography>
                </Box>
                <React.Fragment>
                    {Boolean(pinned.length) && (
                        <Box>
                            <Typography className="text-metahkg-grey" gutterBottom>
                                Pinned
                            </Typography>
                            {pinned.map(CategoryEle)}
                        </Box>
                    )}
                    {tags.map((tag) => (
                        <Box key={tag}>
                            <Typography gutterBottom className="text-metahkg-grey">
                                {tag}
                            </Typography>
                            {categories
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
                                Others
                            </Typography>
                            {others.map(CategoryEle)}
                        </Box>
                    )}
                </React.Fragment>
            </Box>
        </Drawer>
    );
}
