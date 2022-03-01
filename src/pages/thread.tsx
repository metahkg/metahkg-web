import React from "react";
import Conversation from "../components/conversation";
import { Box } from "@mui/material";
import { useParams } from "react-router";
import { useCat, useId, useMenu } from "../components/MenuProvider";
import { useWidth } from "../components/ContextProvider";
/*
 * Thread Component for /thread/:id
 * controls the menu and returns a Conversation
 */
export default function Thread() {
  const params = useParams();
  const [category] = useCat();
  const [id, setId] = useId();
  const [menu, setMenu] = useMenu();
  const [width] = useWidth();
  !menu && !(width < 760) && setMenu(true);
  menu && width < 760 && setMenu(false);
  if (!category && !id) {
    setId(Number(params.id));
  }
  return (
    <Box
      sx={{
        backgroundColor: "primary.dark",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div key={params.id} style={{ width: width < 760 ? "100vw" : "70vw" }}>
        <Conversation id={Number(params.id)} />
      </div>
    </Box>
  );
}
