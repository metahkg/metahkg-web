import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useState, useRef } from "react";
import queryString from "query-string";
const ConversationContext = createContext(null);
export default function ConversationProvider(props) {
    const query = queryString.parse(window.location.search);
    const { threadId, children } = props;
    const [thread, setThread] = useState(null);
    const [finalPage, setFinalPage] = useState(Number(query.page) || Math.floor((Number(query.c) - 1) / 25) + 1 || 1);
    /** Current page */
    const [currentPage, setCurrentPage] = useState(Number(query.page) || Math.floor((Number(query.c) - 1) / 25) + 1 || 1);
    const [userVotes, setUserVotes] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [pages, setPages] = useState(1);
    const [end, setEnd] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reRender, setReRender] = useState(false);
    const [story, setStory] = useState(0);
    const lastHeight = useRef(0);
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [images, setImages] = useState([]);
    const [editor, setEditor] = useState({ open: false });
    const cRoot = useRef(null);
    const cBottom = useRef(null);
    return (_jsx(ConversationContext.Provider, Object.assign({ value: {
            thread: [thread, setThread],
            finalPage: [finalPage, setFinalPage],
            currentPage: [currentPage, setCurrentPage],
            userVotes: [userVotes, setUserVotes],
            updating: [updating, setUpdating],
            pages: [pages, setPages],
            end: [end, setEnd],
            loading: [loading, setLoading],
            reRender: [reRender, setReRender],
            story: [story, setStory],
            galleryOpen: [galleryOpen, setGalleryOpen],
            images: [images, setImages],
            lastHeight: lastHeight,
            title: thread === null || thread === void 0 ? void 0 : thread.title,
            threadId: threadId,
            cRoot: cRoot,
            cBottom: cBottom,
            editor: [editor, setEditor],
        } }, { children: children })));
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
export function useUserVotes() {
    const { userVotes: votes } = React.useContext(ConversationContext);
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
export function useImages() {
    const { images } = React.useContext(ConversationContext);
    return images;
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
//# sourceMappingURL=ConversationContext.js.map