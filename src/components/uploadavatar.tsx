import React from "react";
import { Box, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRef } from "react";
const Input = styled("input")({
  display: "none",
});
/*
 * a form composes of just a button for uploading avatar
 * sends the image to /api/avatar upon uploaded
 * then the avatar is uploaded to S3 and the page reloads
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
          <Button color="secondary" variant="contained" component="span">
            Upload
          </Button>
        </label>
      </form>
    </Box>
  );
}
