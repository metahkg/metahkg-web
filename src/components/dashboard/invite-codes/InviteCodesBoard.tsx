import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import CreateInviteCode from "./create";
import ViewInviteCodes from "./view";
import DeleteInviteCode from "./delete";
import GenerateInviteCode from "./generate";
import { memo } from "react";
const InviteCodesBoard = memo(function InviteCodesBoard() {
    const { t } = useTranslation();
    return (
        <Box>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    {t("dashboard.invite_codes.board.create_accordion_title")}
                </AccordionSummary>
                <AccordionDetails>
                    <CreateInviteCode />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    {t("dashboard.invite_codes.board.generate_accordion_title")}
                </AccordionSummary>
                <AccordionDetails>
                    <GenerateInviteCode />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    {t("dashboard.invite_codes.board.view_accordion_title")}
                </AccordionSummary>
                <AccordionDetails>
                    <ViewInviteCodes />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    {t("dashboard.invite_codes.board.delete_accordion_title")}
                </AccordionSummary>
                <AccordionDetails>
                    <DeleteInviteCode />
                </AccordionDetails>
            </Accordion>
        </Box>
    );
});
export default InviteCodesBoard;
