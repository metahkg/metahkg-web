import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useIsSmallScreen } from "./ContextProvider";
import { Box, SxProps, Theme } from "@mui/material";
import axios from "axios";
import { parse } from "node-html-parser";

/**
 * It creates a text editor that can be used to edit text
 * @param {(a: string, editor: import("tinymce/tinymce").Editor) => void} props.changehandler function triggered on editor change
 * @param {string} props.text initial text of the editor
 * @returns A text editor.
 */
export default function TextEditor(props: {
    onChange?: (a: string, editor: import("tinymce/tinymce").Editor) => void;
    initText?: string;
    className?: string;
    sx?: SxProps<Theme>;
    autoresize?: boolean;
    toolbarBottom?: boolean;
    toolbarSticky?: boolean;
    noMenuBar?: boolean;
    noStatusBar?: boolean;
}) {
    const {
        onChange,
        initText,
        className,
        sx,
        autoresize,
        toolbarBottom,
        toolbarSticky,
        noMenuBar,
        noStatusBar,
    } = props;
    const isSmallScreen = useIsSmallScreen();
    return (
        <Box sx={sx} className={className}>
            <Editor
                key={Number(isSmallScreen)}
                onEditorChange={(a, editor) => {
                    const parsed = parse(a);
                    parsed.querySelectorAll("img").forEach((img) => {
                        console.log("set attribute");
                        img.setAttribute(
                            "style",
                            "object-fit: contain; height: 100%; max-height: 400px; max-width: 100%;"
                        );
                    });
                    if (parsed.toString() !== parse(a).toString())
                        editor.setContent(parsed.toString());
                    onChange && onChange(parsed.toString(), editor);
                }}
                initialValue={initText}
                init={{
                    height: isSmallScreen ? 310 : 350,
                    skin_url:
                        "https://cdn.jsdelivr.net/npm/metahkg-css@latest/dist/tinymce/skins/ui/metahkg-dark",
                    content_css:
                        "https://cdn.jsdelivr.net/npm/metahkg-css@latest/dist/tinymce/skins/content/metahkg-dark/content.min.css",
                    branding: false,
                    ...(noStatusBar && { statusbar: false }),
                    mobile: {
                        menubar: noMenuBar ? false : "file edit view insert format tools",
                        toolbar:
                            "undo redo | bold italic underline strikethrough | image template link codesample | fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen preview save print | insertfile media anchor | ltr rtl",
                    },
                    quickbars_selection_toolbar:
                        "cut copy paste | formatselect | quicklink",
                    quickbars_insert_toolbar: "",
                    menubar: noMenuBar
                        ? false
                        : "file edit view insert format tools table",
                    plugins: `${
                        autoresize ? "autoresize" : ""
                    } preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons`,
                    toolbar:
                        "undo redo | bold italic underline strikethrough | image template link codesample | fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen preview save print | insertfile media anchor | ltr rtl",
                    toolbar_sticky: toolbarSticky,
                    toolbar_mode: "sliding",
                    ...(toolbarBottom && { toolbar_location: "bottom" }),
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
                    images_upload_handler: async (blobInfo, progress) => {
                        const formData = new FormData();
                        formData.append("image", blobInfo.blob());
                        const { data } = await axios.post(
                            "https://api.na.cx/upload",
                            formData,
                            {
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                },
                            }
                        );
                        return data.url;
                    },
                }}
                tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.0.3/tinymce.min.js"
            />
        </Box>
    );
}
