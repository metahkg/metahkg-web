import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box } from "@mui/material";
import CreateCategory from "./create";
import EditCategory from "./edit";
import DeleteCategory from "./delete";
import { memo } from "react";
const CategoriesBoard = memo(function CategoriesBoard() {
    return (
        <Box>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    Create Category
                </AccordionSummary>
                <AccordionDetails>
                    <CreateCategory />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    Edit Category
                </AccordionSummary>
                <AccordionDetails>
                    <EditCategory />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    Delete Category
                </AccordionSummary>
                <AccordionDetails>
                    <DeleteCategory />
                </AccordionDetails>
            </Accordion>
        </Box>
    );
});
export default CategoriesBoard;
