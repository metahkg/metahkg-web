import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box } from "@mui/material";
import CreateInviteCode from "./create";
import ViewInviteCodes from "./view";
import DeleteInviteCode from "./delete";
import GenerateInviteCode from "./generate";

export default function InviteCodesBoard() {
    return (
        <Box>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    Create Invite Code
                </AccordionSummary>
                <AccordionDetails>
                    <CreateInviteCode />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    Generate Invite Code
                </AccordionSummary>
                <AccordionDetails>
                    <GenerateInviteCode />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    View Invite Codes
                </AccordionSummary>
                <AccordionDetails>
                    <ViewInviteCodes />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    Delete Invite Code
                </AccordionSummary>
                <AccordionDetails>
                    <DeleteInviteCode />
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}
