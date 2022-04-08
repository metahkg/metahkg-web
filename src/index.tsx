import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import App from "./App";
import MenuProvider from "./components/MenuProvider";
import ContextProvider from "./components/ContextProvider";

ReactDOM.render(
  <ContextProvider>
    <MenuProvider>
      <App />
    </MenuProvider>
  </ContextProvider>,
  document.getElementById("root")
);
