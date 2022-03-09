import React from "react";
import { Editor } from "@tinymce/tinymce-react";
/**
 * It creates a text editor that can be used to edit text
 * @param {(a: string, editor: import("tinymce/tinymce").Editor) => void} props.changehandler function triggered on editor change
 * @param {string} props.text initial text of the editor
 * @returns A text editor.
 */
export default function TextEditor(props: {
  changehandler: (a: string, editor: import("tinymce/tinymce").Editor) => void;
  text: string;
}) {
  const { changehandler, text } = props;
  return (
    <Editor
      onEditorChange={changehandler}
      initialValue={text}
      init={{
        height: 330,
        skin_url: "/tinymce/skins/ui/metahkg-dark",
        content_css: "/tinymce/skins/content/metahkg-dark/content.min.css",
        mobile: {
          menubar: true,
        },
        imagetools_cors_hosts: ["picsum.photos"],
        quickbars_selection_toolbar: 'cut copy paste | formatselect | quicklink template',
        quickbars_insert_toolbar: '',
        menubar: "file edit view insert format tools table",
        plugins:
          "print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons",
        toolbar:
          "undo redo | link image template codesample | emoticons | bold italic underline strikethrough forecolor backcolor | numlist bullist | alignleft aligncenter alignright alignjustify | outdent indent | formatselect fontsizeselect | media table removeformat pagebreak | template charmap | fullscreen preview save print | insertfile anchor codesample | ltr rtl | help",
        toolbar_sticky: true,
        templates: [
          {title: "Quote", description: "Add a quote.", content: `<blockquote style="color: #aca9a9; border-left: 2px solid #aca9a9; margin-left: 0"><div style="margin-left: 15px">quote</div></blockquote><p></p>`}
        ],
        autosave_ask_before_unload: true,
        autosave_interval: "30s",
        autosave_prefix: "{path}{query}-{id}-",
        autosave_restore_when_empty: false,
        autosave_retention: "2m",
        image_advtab: true,
      }}
      tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/5.10.3/tinymce.min.js"
    />
  );
}
