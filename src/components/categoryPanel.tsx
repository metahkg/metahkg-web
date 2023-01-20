import React, { useCallback } from "react";
import { Category } from "@metahkg/api";
import { Box, Drawer } from "@mui/material";
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
                className="no-underline"
                onClick={toggleDrawer(false)}
            >
                <h5
                    className={`${
                        currentCategory === category.id
                            ? "text-metahkg-yellow"
                            : "text-metahkg-grey"
                    } hover:text-metahkg-yellow`}
                >
                    {category.name}
                </h5>
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
            <Box className="ml-[15px] w-[200px] max-w-full" role="presentation">
                <Box className="flex items-end my-[20px]">
                    <MetahkgLogo svg light height={30} width={30} />
                    <h3 className="ml-[5px] my-0">Categories</h3>
                </Box>
                <React.Fragment>
                    {pinned.map(CategoryEle)}
                    {tags.map((tag) => (
                        <Box key={tag}>
                            <h4>{tag}</h4>
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
                            <h4>Others</h4>
                            {others.map(CategoryEle)}
                        </Box>
                    )}
                </React.Fragment>
            </Box>
        </Drawer>
    );
}
