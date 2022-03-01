import React from "react";
import { Editor } from "@tinymce/tinymce-react";
/*
 * Tinymce editor configured for Metahkg
 */
export default function TextEditor(props: {
  changehandler: (a: string, editor: import("tinymce/tinymce").Editor) => void;
  text: string;
}) {
  const {changehandler, text} = props;
  return (
    <Editor
      onEditorChange={changehandler}
      initialValue={text}
      init={{
        height: 300,
        menubar: true,
        skin: "oxide-dark",
        content_css: "dark",
        mobile: {
          menubar: true,
        },
        plugins: [
          "advlist autolink lists link image imagetools charmap print preview anchor textcolor",
          "searchreplace visualblocks code fullscreen autosave",
          "insertdatetime media table paste code wordcount",
        ],
        toolbar: `undo redo | cut copy paste | link image | formatselect | bold italic underline forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat`,
      }}
      tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/5.10.3/tinymce.min.js"
    />
  );
}
