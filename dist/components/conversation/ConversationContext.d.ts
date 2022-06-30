import React from "react";
import { threadType } from "../../types/conversation/thread";
import { commentType } from "../../types/conversation/comment";
interface editorStateType {
    open: boolean;
    quote?: commentType;
}
export default function ConversationProvider(props: {
    children: JSX.Element | JSX.Element[];
    threadId: number;
}): JSX.Element;
export declare function useThread(): [threadType, React.Dispatch<React.SetStateAction<threadType>>];
export declare function useFinalPage(): [number, React.Dispatch<React.SetStateAction<number>>];
export declare function useCurrentPage(): [number, React.Dispatch<React.SetStateAction<number>>];
export declare function useUserVotes(): [{
    [id: number]: "U" | "D";
}, React.Dispatch<React.SetStateAction<{
    [id: number]: "U" | "D";
}>>];
export declare function useUpdating(): [boolean, React.Dispatch<React.SetStateAction<boolean>>];
export declare function usePages(): [number, React.Dispatch<React.SetStateAction<number>>];
export declare function useEnd(): [boolean, React.Dispatch<React.SetStateAction<boolean>>];
export declare function useLoading(): [boolean, React.Dispatch<React.SetStateAction<boolean>>];
export declare function useRerender(): [boolean, React.Dispatch<React.SetStateAction<boolean>>];
export declare function useStory(): [number, React.Dispatch<React.SetStateAction<number>>];
export declare function useGalleryOpen(): [boolean, React.Dispatch<React.SetStateAction<boolean>>];
export declare function useImages(): [{
    src: string;
}[], React.Dispatch<React.SetStateAction<{
    src: string;
}[]>>];
export declare function useLastHeight(): React.MutableRefObject<number>;
export declare function useThreadId(): number;
export declare function useTitle(): string;
export declare function useCRoot(): React.MutableRefObject<HTMLDivElement>;
export declare function useCBottom(): React.MutableRefObject<HTMLDivElement>;
export declare function useEditor(): [editorStateType, React.Dispatch<React.SetStateAction<editorStateType>>];
export {};
