import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box } from "@mui/material";
import EditThread from "./edit";
import DeleteThread from "./delete";
import { memo } from "react";
const ThreadsBoard = memo(function ThreadsBoard() {
    return (
        <Box>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    Edit Thread
                </AccordionSummary>
                <AccordionDetails>
                    <EditThread />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    Delete Thread
                </AccordionSummary>
                <AccordionDetails>
                    <DeleteThread />
                </AccordionDetails>
            </Accordion>
        </Box>
    );
});
export default ThreadsBoard;
