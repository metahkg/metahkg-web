import React from "react";
import { Box, Button, Divider } from "@mui/material";
import { Shimmer } from "../../lib/shimmer/shimmer";
import { roundup } from "../../lib/common";
import { useSearch } from "../MenuProvider";
import { useHeight, useWidth } from "../ContextProvider";
export default function MenuPreload() {
  const [search] = useSearch();
  const [width] = useWidth();
  const [height] = useHeight();
  const totalheight = height - (search ? 151 : 91);
  const amount = roundup(totalheight / 72);
  const buttonwidth = width < 760 ? width : 0.3 * width;
  return (
    <Box sx={{ backgroundColor: "#primary.main", minHeight: totalheight }}>
      {[...Array(amount)].map(() => (
        <div>
          <Button
            sx={{
              height: 72,
              width: "100%",
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Shimmer height={20} width={buttonwidth * 0.45} />
            <div style={{ height: "10px" }} />
            <Shimmer height={24} width={buttonwidth * 0.8} />
          </Button>
          <Divider />
        </div>
      ))}
    </Box>
  );
}
