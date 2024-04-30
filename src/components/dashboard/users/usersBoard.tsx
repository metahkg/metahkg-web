import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box } from "@mui/material";
import SearchUsers from "./search";

export default function UsersBoard() {
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
}
