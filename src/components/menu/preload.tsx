import "./css/preload.css";
import React from "react";
import { Box, Button, Divider } from "@mui/material";
import { Shimmer } from "../../lib/shimmer/shimmer";
import { roundup } from "../../lib/common";
import { useSearch } from "../MenuProvider";
import { useHeight, useWidth } from "../ContextProvider";
/* A component that is used to preload the menu. */
export default function MenuPreload() {
  const [search] = useSearch();
  const [width] = useWidth();
  const [height] = useHeight();
  const totalheight = height - (search ? 151 : 91);
  const amount = roundup(totalheight / 72);
  const buttonwidth = width < 760 ? width : 0.3 * width;
  return (
    <Box className="preload-root" sx={{ minHeight: totalheight }}>
      {[...Array(amount)].map(() => (
        <div>
          <Button className="fullwidth flex align-flex-start flex-dir-column justify-center preload-btn">
            <Shimmer className="ml10" height={20} width={buttonwidth * 0.45} />
            <div className="ml10 preload-spacer" />
            <Shimmer className="ml10" height={24} width={buttonwidth * 0.8} />
          </Button>
          <Divider />
        </div>
      ))}
    </Box>
  );
}
