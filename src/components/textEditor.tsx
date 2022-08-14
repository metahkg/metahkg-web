import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useIsSmallScreen } from "./ContextProvider";
import { Box, SxProps, Theme } from "@mui/material";
import axios from "axios";
import { parseError } from "../lib/parseError";

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
                onEditorChange={onChange}
                initialValue={initText}
                init={{
                    height: isSmallScreen ? 310 : 350,
                    skin_url:
                        "https://cdn.jsdelivr.net/npm/metahkg-css@1.1.0/dist/tinymce/skins/ui/metahkg-dark",
                    content_css:
                        "https://cdn.jsdelivr.net/npm/metahkg-css@1.1.0/dist/tinymce/skins/content/metahkg-dark/content.min.css",
                    branding: false,
                    ...(noStatusBar && { statusbar: false }),
                    setup: (editor) => {
                        editor.ui.registry.addButton("uploadimage", {
                            icon: "upload",
                            onAction: () => {
                                const input = document.createElement("input");
                                input.type = "file";
                                input.accept = "image/*";
                                input.onchange = async (e) => {
                                    const file = (e.target as HTMLInputElement)
                                        ?.files?.[0];
                                    if (file) {
                                        editor.windowManager.open({
                                            title: "Upload image",
                                            body: {
                                                type: "panel",
                                                items: [
                                                    {
                                                        type: "htmlpanel",
                                                        html: "<p>Uploading your image...</p>",
                                                    },
                                                ],
                                            },
                                            buttons: [
                                                {
                                                    type: "submit",
                                                    text: "OK",
                                                    buttonType: "primary",
                                                },
                                            ],
                                            onSubmit: () => {
                                                editor.windowManager.close();
                                            },
                                        });
                                        const formData = new FormData();
                                        formData.append("image", file);
                                        axios
                                            .post("https://api.na.cx/upload", formData, {
                                                headers: {
                                                    "Content-Type": "multipart/form-data",
                                                },
                                            })
                                            .then((res) => {
                                                editor.windowManager.close();
                                                editor.insertContent(
                                                    `<img alt="" src="${res.data.url}" />`
                                                );
                                            })
                                            .catch((err) => {
                                                editor.windowManager.close();
                                                editor.windowManager.open({
                                                    title: "Error",
                                                    body: {
                                                        type: "panel",
                                                        items: [
                                                            {
                                                                type: "alertbanner",
                                                                text: `Error uploading image: ${parseError(
                                                                    err
                                                                )}`,
                                                                level: "error",
                                                                icon: "warning",
                                                            },
                                                        ],
                                                    },
                                                    buttons: [
                                                        {
                                                            type: "submit",
                                                            text: "OK",
                                                            buttonType: "primary",
                                                        },
                                                    ],
                                                    onSubmit: () => {
                                                        editor.windowManager.close();
                                                    },
                                                });
                                            });
                                    }
                                };
                                input.click();
                            },
                        });
                    },
                    mobile: {
                        menubar: noMenuBar ? false : "file edit view insert format tools",
                        toolbar:
                            "undo redo | bold italic underline strikethrough | emoticons | uploadimage image template link codesample | fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap | fullscreen preview save print | insertfile media anchor | ltr rtl",
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
                        "undo redo | bold italic underline strikethrough | emoticons | uploadimage image template link codesample | fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap | fullscreen preview save print | insertfile media anchor | ltr rtl",
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
                        { text: "TypeScript", value: "typescript" },
                        { text: "TypeScript React", value: "tsx" },
                        { text: "JavaScript", value: "javascript" },
                        { text: "JavaScript React", value: "jsx" },
                        { text: "Python", value: "python" },
                        { text: "Bash", value: "bash" },
                        { text: "JSON", value: "json" },
                        { text: "HTML", value: "html" },
                        { text: "XML", value: "xml" },
                        { text: "SVG", value: "svg" },
                        { text: "YAML", value: "yaml" },
                        { text: "CSS", value: "css" },
                        { text: "SASS", value: "sass" },
                        { text: "Markdown", value: "md" },
                        { text: "Mongodb", value: "mongodb" },
                        { text: "SQL", value: "sql" },
                        { text: "C", value: "c" },
                        { text: "C++", value: "cpp" },
                        { text: "C#", value: "csharp" },
                        { text: "Java", value: "java" },
                        { text: "Scala", value: "scala" },
                        { text: "Kotlin", value: "kotlin" },
                        { text: "Swift", value: "swift" },
                        { text: "Go", value: "go" },
                        { text: "Rust", value: "rust" },
                        { text: "Ruby", value: "ruby" },
                        { text: "PHP", value: "php" },
                    ],
                    autosave_ask_before_unload: true,
                    autosave_interval: "10s",
                    autosave_prefix: "{path}{query}-{id}-",
                    autosave_restore_when_empty: false,
                    autosave_retention: "2m",
                    image_advtab: true,
                    images_upload_handler: async (blobInfo, _progress) => {
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
                tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.1.2/tinymce.min.js"
            />
        </Box>
    );
}
