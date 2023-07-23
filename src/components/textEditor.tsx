/*
 Copyright (C) 2022-present Metahkg Contributors

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useDarkMode, useIsSmallScreen, useServerConfig } from "./AppContextProvider";
import { Box, SxProps, Theme } from "@mui/material";
import axios from "axios";
import { parseError } from "../lib/parseError";
import { useSession } from "./AppContextProvider";

export default function TextEditor(props: {
    onChange?: (a: string, editor: import("tinymce/tinymce").Editor) => void;
    initText?: string;
    className?: string;
    sx?: SxProps<Theme>;
    autoResize?: boolean;
    toolbarBottom?: boolean;
    toolbarSticky?: boolean;
    noMenuBar?: boolean;
    noStatusBar?: boolean;
    minHeight?: number;
    lengthLimit?: number;
    noAutoSave?: boolean;
}) {
    const {
        onChange,
        initText,
        className,
        sx,
        autoResize: autoresize,
        toolbarBottom,
        toolbarSticky,
        noMenuBar,
        noStatusBar,
        minHeight,
        lengthLimit,
        noAutoSave,
    } = props;

    const isSmallScreen = useIsSmallScreen();
    const [session] = useSession();
    const darkMode = useDarkMode();
    const [serverConfig] = useServerConfig();
    const editorRef = useRef<Editor>(null);
    const [reload, setReload] = useState(false);
    const [replaceContent, setReplaceContent] = useState("");

    useEffect(() => {
        const content = editorRef?.current?.editor?.getContent();
        setReload(!reload);
        if (content) {
            setTimeout(() => {
                setReplaceContent(content);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [darkMode]);

    useEffect(() => {
        if (replaceContent) {
            editorRef?.current?.editor?.setContent(replaceContent);
            setReplaceContent("");
        }
    }, [replaceContent]);

    const onEditorChange = useCallback(
        (a: string, editor: import("tinymce/tinymce").Editor) => {
            if (lengthLimit) {
                if (a.length > lengthLimit) {
                    a = a.substring(0, lengthLimit);
                    editor.setContent(a);
                    editor.windowManager.alert(
                        "Content exceeded length limit. Automatically truncated.",
                    );
                    return;
                }
            }
            onChange?.(a, editor);
        },
        [onChange, lengthLimit],
    );

    return (
        <Box sx={sx} className={className}>
            <Editor
                ref={editorRef}
                key={Number(reload)}
                onEditorChange={onEditorChange}
                initialValue={initText || undefined}
                init={{
                    height: isSmallScreen ? 310 : 350,
                    ...(minHeight && { min_height: minHeight }),
                    ...(darkMode
                        ? {
                              skin_url:
                                  "https://cdn.jsdelivr.net/npm/@metahkg/tinymce-skins@1.0.0/ui/metahkg-dark",
                              content_css:
                                  "https://cdn.jsdelivr.net/npm/@metahkg/tinymce-skins@1.0.0/content/metahkg-dark/content.min.css",
                          }
                        : { skin: "oxide" }),
                    branding: false,
                    promotion: false,
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
                                        formData.append("file", file);
                                        axios
                                            .post(
                                                `https://${serverConfig?.domains.images}/upload`,
                                                formData,
                                                {
                                                    headers: {
                                                        "Content-Type":
                                                            "multipart/form-data",
                                                        Authorization: `Bearer ${session?.token}`,
                                                    },
                                                },
                                            )
                                            .then((res) => {
                                                editor.windowManager.close();
                                                editor.insertContent(
                                                    `<img alt="" src="${res.data.url}" />`,
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
                                                                    err,
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
                    } preview importcss searchreplace autolink ${
                        noAutoSave ? "" : "autosave"
                    } save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons`,
                    toolbar:
                        "undo redo | bold italic underline strikethrough | emoticons | uploadimage image template link codesample | fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap | fullscreen preview save print | insertfile media anchor | ltr rtl",
                    toolbar_sticky: toolbarSticky,
                    toolbar_mode: "sliding",
                    ...(toolbarBottom && { toolbar_location: "bottom" }),
                    templates: [
                        {
                            title: "Quote",
                            description: "Add a quote.",
                            content: /*html*/ `<blockquote style="color: #aca9a9; border-left: 2px solid ${
                                darkMode ? "#646262" : "e7e7e7"
                            }; margin-left: 0"><div style="margin-left: 15px">quote</div></blockquote><p></p>`,
                        },
                    ],
                    browser_spellcheck: true,
                    contextmenu: false,
                    codesample_global_prismjs: true,
                    codesample_languages: [
                        { text: "Bash", value: "bash" },
                        { text: "Python", value: "python" },
                        { text: "Markdown", value: "md" },
                        { text: "TypeScript", value: "typescript" },
                        { text: "TypeScript React", value: "tsx" },
                        { text: "JavaScript", value: "javascript" },
                        { text: "JavaScript React", value: "jsx" },
                        { text: "JSON", value: "json" },
                        { text: "HTML", value: "html" },
                        { text: "XML", value: "xml" },
                        { text: "SVG", value: "svg" },
                        { text: "YAML", value: "yaml" },
                        { text: "CSS", value: "css" },
                        { text: "SASS", value: "sass" },
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
                    autosave_interval: "20s",
                    autosave_prefix: "tinymce-autosave-{path}-",
                    autosave_restore_when_empty: false,
                    autosave_retention: "30m",
                    image_advtab: true,
                    images_upload_handler: async (blobInfo, _progress) => {
                        const formData = new FormData();
                        formData.append("file", blobInfo.blob());
                        const { data } = await axios.post(
                            `https://${serverConfig?.domains.images}/upload`,
                            formData,
                            {
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                    Authorization: `Bearer ${session?.token}`,
                                },
                            },
                        );
                        return data.url;
                    },
                }}
                tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.3.1/tinymce.min.js"
            />
        </Box>
    );
}
