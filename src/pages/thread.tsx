import React, { useState } from "react";
import Conversation from "../components/conversation";
import { Box, LinearProgress } from "@mui/material";
import { useParams } from "react-router";
import { Navigate } from "react-router-dom";
import { useCat, useId, useMenu } from "../components/MenuProvider";
import { useWidth } from "../components/ContextProvider";
import isInteger from "is-sn-integer";
/**
 * Thread Component for /thread/:id
 * controls the menu and returns a Conversation
 */
export default function Thread() {
  const params = useParams();
  const [category] = useCat();
  const [id, setId] = useId();
  const [menu, setMenu] = useMenu();
  const [width] = useWidth();
  const [loading, setLoading] = useState(true);
  if (!isInteger(params.id)) return <Navigate to="/404" replace />;
  !menu && !(width < 760) && setMenu(true);
  menu && width < 760 && setMenu(false);
  !category && !id && setId(Number(params.id));
  return (
    <Box
      className="min-height-fullvh flex"
      sx={{
        backgroundColor: "primary.dark",
      }}
    >
      <div style={{ width: width < 760 ? "100vw" : "70vw" }}>
        {loading && <LinearProgress className="fullwidth" color="secondary" />}
        <Conversation key={Number(params.id)} id={Number(params.id)} loading={[loading, setLoading]} />
      </div>
    </Box>
  );
}
