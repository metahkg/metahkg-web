import React, { createContext, useState, useRef } from "react";
import { threadType } from "../../types/conversation/thread";
import queryString from "query-string";
import { commentType } from "../../types/conversation/comment";

interface editorStateType {
    open: boolean;
    quote?: commentType;
    edit?: string;
}

const ConversationContext = createContext<{
    thread: [null | threadType, React.Dispatch<React.SetStateAction<null | threadType>>];
    finalPage: [number, React.Dispatch<React.SetStateAction<number>>];
    currentPage: [number, React.Dispatch<React.SetStateAction<number>>];
    votes: [
        { cid: number; vote: "U" | "D" }[] | null,
        React.Dispatch<React.SetStateAction<{ cid: number; vote: "U" | "D" }[] | null>>
    ];
    updating: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    pages: [number, React.Dispatch<React.SetStateAction<number>>];
    end: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    loading: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    reRender: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    story: [number, React.Dispatch<React.SetStateAction<number>>];
    lastHeight: React.MutableRefObject<number>;
    galleryOpen: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    editor: [editorStateType, React.Dispatch<React.SetStateAction<editorStateType>>];
    title: string | undefined;
    threadId: number;
    cRoot: React.MutableRefObject<HTMLDivElement | null>;
    cBottom: React.MutableRefObject<HTMLDivElement | null>;
    // @ts-ignore
}>(null);

export default function ConversationProvider(props: {
    children: JSX.Element | JSX.Element[];
    threadId: number;
}) {
    const query = queryString.parse(window.location.search);
    const { threadId, children } = props;
    const [thread, setThread] = useState<threadType | null>(null);
    const [finalPage, setFinalPage] = useState(
        Number(query.page) || Math.floor((Number(query.c) - 1) / 25) + 1 || 1
    );
    /** Current page */
    const [currentPage, setCurrentPage] = useState(
        Number(query.page) || Math.floor((Number(query.c) - 1) / 25) + 1 || 1
    );
    const [votes, setVotes] = useState<{ cid: number; vote: "U" | "D" }[] | null>(null);
    const [updating, setUpdating] = useState(false);
    const [pages, setPages] = useState(1);
    const [end, setEnd] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reRender, setReRender] = useState(false);
    const [story, setStory] = useState(0);
    const lastHeight = useRef(0);
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [editor, setEditor] = useState<editorStateType>({ open: false });
    const cRoot = useRef<HTMLDivElement>(null);
    const cBottom = useRef<HTMLDivElement>(null);
    return (
        <ConversationContext.Provider
            value={{
                thread: [thread, setThread],
                finalPage: [finalPage, setFinalPage],
                currentPage: [currentPage, setCurrentPage],
                votes: [votes, setVotes],
                updating: [updating, setUpdating],
                pages: [pages, setPages],
                end: [end, setEnd],
                loading: [loading, setLoading],
                reRender: [reRender, setReRender],
                story: [story, setStory],
                galleryOpen: [galleryOpen, setGalleryOpen],
                lastHeight: lastHeight,
                title: thread?.title,
                threadId: threadId,
                cRoot: cRoot,
                cBottom: cBottom,
                editor: [editor, setEditor],
            }}
        >
            {children}
        </ConversationContext.Provider>
    );
}

export function useThread() {
    const { thread } = React.useContext(ConversationContext);
    return thread;
}

export function useFinalPage() {
    const { finalPage } = React.useContext(ConversationContext);
    return finalPage;
}

export function useCurrentPage() {
    const { currentPage } = React.useContext(ConversationContext);
    return currentPage;
}

export function useVotes() {
    const { votes } = React.useContext(ConversationContext);
    return votes;
}

export function useUpdating() {
    const { updating } = React.useContext(ConversationContext);
    return updating;
}

export function usePages() {
    const { pages } = React.useContext(ConversationContext);
    return pages;
}

export function useEnd() {
    const { end } = React.useContext(ConversationContext);
    return end;
}

export function useLoading() {
    const { loading } = React.useContext(ConversationContext);
    return loading;
}

export function useRerender() {
    const { reRender } = React.useContext(ConversationContext);
    return reRender;
}

export function useStory() {
    const { story } = React.useContext(ConversationContext);
    return story;
}

export function useGalleryOpen() {
    const { galleryOpen } = React.useContext(ConversationContext);
    return galleryOpen;
}

export function useLastHeight() {
    const { lastHeight } = React.useContext(ConversationContext);
    return lastHeight;
}

export function useThreadId() {
    const { threadId } = React.useContext(ConversationContext);
    return threadId;
}

export function useTitle() {
    const { title } = React.useContext(ConversationContext);
    return title;
}

export function useCRoot() {
    const { cRoot } = React.useContext(ConversationContext);
    return cRoot;
}

export function useCBottom() {
    const { cBottom } = React.useContext(ConversationContext);
    return cBottom;
}

export function useEditor() {
    const { editor } = React.useContext(ConversationContext);
    return editor;
}
