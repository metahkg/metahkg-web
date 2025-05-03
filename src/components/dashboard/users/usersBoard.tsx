import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import SearchUsers from "./search";
import { memo } from "react";
const UsersBoard = memo(function UsersBoard() {
    const { t } = useTranslation();
    return (
        <Box>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    {t("dashboard.users.board.search_accordion_title")}
                </AccordionSummary>
                <AccordionDetails>
                    <SearchUsers />
                </AccordionDetails>
            </Accordion>
        </Box>
    );
});
export default UsersBoard;
