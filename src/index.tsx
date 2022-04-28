import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import App from "./App";
import loadable from "@loadable/component";

const MenuProvider = loadable(() => import("./components/MenuProvider"));
const ContextProvider = loadable(() => import("./components/ContextProvider"));

// import { createStore, applyMiddleware } from "redux";
// import { composeWithDevTools } from "@redux-devtools/extension";
// import reducer from "./reducer/index";
// import thunk from "redux-thunk";
// import { Provider } from "react-redux";

// const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));
// @ts-ignore

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    // <Provider store={store}>
    <ContextProvider>
        <MenuProvider>
            <App />
        </MenuProvider>
    </ContextProvider>
    // </Provider>
);
