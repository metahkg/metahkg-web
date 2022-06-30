import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import MetahkgWebApp from "./main";

const root = document.getElementById("root");
if (root) {
    const ReactRoot = ReactDOM.createRoot(root);
    ReactRoot.render(<MetahkgWebApp />);
}
