import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box } from "@mui/material";
import SearchUsers from "./search";
import { memo } from "react";
const UsersBoard = memo(function UsersBoard() {
    return (
        <Box>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    Search Users
                </AccordionSummary>
                <AccordionDetails>
                    <SearchUsers />
                </AccordionDetails>
            </Accordion>
        </Box>
    );
});
export default UsersBoard;
