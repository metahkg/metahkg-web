import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import EditThread from "./edit";
import DeleteThread from "./delete";
import { memo } from "react";
const ThreadsBoard = memo(function ThreadsBoard() {
    const { t } = useTranslation();
    return (
        <Box>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    {t("dashboard.threads.board.edit_accordion_title")}
                </AccordionSummary>
                <AccordionDetails>
                    <EditThread />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    {t("dashboard.threads.board.delete_accordion_title")}
                </AccordionSummary>
                <AccordionDetails>
                    <DeleteThread />
                </AccordionDetails>
            </Accordion>
        </Box>
    );
});
export default ThreadsBoard;
