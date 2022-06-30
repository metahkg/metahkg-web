/// <reference types="react" />
import { SxProps, Theme } from "@mui/material";
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
}): JSX.Element;
