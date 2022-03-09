import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRef } from "react";
import { FileUpload } from "@mui/icons-material";
const Input = styled("input")({
  display: "none",
});
/**
 * It's a form that uploads an image to the server
 * @returns A form with a file input.
 */
export default function UploadAvatar() {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <Box>
      <form
        ref={formRef}
        name="avatar"
        id="avatar"
        method="post"
        action="/api/avatar"
        encType="multipart/form-data"
      >
        <label htmlFor="contained-button-file">
          <Input
            accept="image/*"
            id="contained-button-file"
            type="file"
            name="avatar"
            onChange={() => {
              formRef?.current?.submit();
            }}
          />
          <Button className="mt5 notexttransform" variant="contained" component="span">
            <FileUpload className="mr5" /><Typography sx={{color: "secondary.main"}}>Upload</Typography>
          </Button>
        </label>
      </form>
    </Box>
  );
}
