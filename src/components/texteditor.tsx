import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useWidth } from "./ContextProvider";
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
  const [width] = useWidth();
  return (
    <Editor
      key={Number(width < 760)}
      onEditorChange={changehandler}
      initialValue={text}
      init={{
        height: width < 760 ? 310 : 350,
        skin_url:
          "https://cdn.jsdelivr.net/npm/metahkg-css/dist/tinymce/skins/ui/metahkg-dark",
        content_css:
          "https://cdn.jsdelivr.net/npm/metahkg-css/dist/tinymce/skins/content/metahkg-dark/content.min.css",
        branding: false,
        mobile: {
          menubar: "file edit view insert format tools",
          toolbar:
            "undo redo | link image template codesample | emoticons | formatselect fontsizeselect bold italic underline strikethrough forecolor backcolor | numlist bullist | alignleft aligncenter alignright alignjustify | outdent indent | media table removeformat pagebreak | charmap | fullscreen preview save print | ltr rtl | anchor help",
        },
        quickbars_selection_toolbar:
          "cut copy paste | fontsizeselect | quicklink",
        quickbars_insert_toolbar: "",
        menubar: "file edit view insert format tools table",
        plugins:
          "print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount textpattern noneditable help charmap quickbars emoticons",
        toolbar:
          "undo redo | link image template codesample | emoticons | formatselect bold italic underline strikethrough forecolor backcolor | numlist bullist | alignleft aligncenter alignright alignjustify | outdent indent | media table removeformat pagebreak | charmap | fullscreen preview save print | ltr rtl | anchor help",
        toolbar_sticky: true,
        templates: [
          {
            title: "Quote",
            description: "Add a quote.",
            content: `<blockquote style="color: #aca9a9; border-left: 2px solid #646262; margin-left: 0"><div style="margin-left: 15px">quote</div></blockquote><p></p>`,
          },
        ],
        codesample_global_prismjs: true,
        codesample_languages: [
          { text: "JavaScript", value: "javascript" },
          { text: "TypeScript", value: "typescript" },
          { text: "React JSX", value: "jsx" },
          { text: "React TSX", value: "tsx" },
          { text: "Python", value: "python" },
          { text: "HTML/XML", value: "markup" },
          { text: "JSON", value: "json" },
          { text: "CSS", value: "css" },
          { text: "Go", value: "go" },
          { text: "PHP", value: "php" },
          { text: "Ruby", value: "ruby" },
          { text: "Java", value: "java" },
          { text: "C", value: "c" },
          { text: "C#", value: "csharp" },
          { text: "C++", value: "cpp" },
        ],
        autosave_ask_before_unload: true,
        autosave_interval: "10s",
        autosave_prefix: "{path}{query}-{id}-",
        autosave_restore_when_empty: false,
        autosave_retention: "2m",
        image_advtab: true,
      }}
      tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.0.0/tinymce.min.js"
    />
  );
}
