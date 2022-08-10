import React from "react";
import ReactDOM from "react-dom/client";
import MetahkgWebApp from "./App";

const root = document.getElementById("root");
if (root) {
    const ReactRoot = ReactDOM.createRoot(root);
    ReactRoot.render(<MetahkgWebApp />);
}
