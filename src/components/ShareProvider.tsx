import React, { createContext, useContext, useState } from "react";

const ShareContext = createContext<any>({});
export function ShareProvider(props: {
  children: JSX.Element | JSX.Element[];
}) {
  const [shareOpen, setShareOpen] = useState(false);
  const [shareTitle, setShareTitle] = useState("");
  const [shareLink, setShareLink] = useState("");
  return (
    <ShareContext.Provider
      value={{
        shareOpen: [shareOpen, setShareOpen],
        shareTitle: [shareTitle, setShareTitle],
        shareLink: [shareLink, setShareLink],
      }}
    >
      {props.children}
    </ShareContext.Provider>
  );
}
export function useShareOpen(): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>
] {
  const { shareOpen } = useContext(ShareContext);
  return shareOpen;
}
export function useShareTitle(): [
  string,
  React.Dispatch<React.SetStateAction<string>>
] {
  const { shareTitle } = useContext(ShareContext);
  return shareTitle;
}
export function useShareLink(): [
  string,
  React.Dispatch<React.SetStateAction<string>>
] {
  const { shareLink } = useContext(ShareContext);
  return shareLink;
}
