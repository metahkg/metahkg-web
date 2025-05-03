import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import CreateCategory from "./create";
import EditCategory from "./edit";
import DeleteCategory from "./delete";
import { memo } from "react";
const CategoriesBoard = memo(function CategoriesBoard() {
    const { t } = useTranslation();
    return (
        <Box>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    {t("categoriesBoard.create_category")}
                </AccordionSummary>
                <AccordionDetails>
                    <CreateCategory />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    {t("categoriesBoard.edit_category")}
                </AccordionSummary>
                <AccordionDetails>
                    <EditCategory />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    {t("categoriesBoard.delete_category")}
                </AccordionSummary>
                <AccordionDetails>
                    <DeleteCategory />
                </AccordionDetails>
            </Accordion>
        </Box>
    );
});
export default CategoriesBoard;
