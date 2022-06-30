import App from "./App";
import ContextProvider from "./components/ContextProvider";
import MenuProvider from "./components/MenuProvider";

// import { createStore, applyMiddleware } from "redux";
// import { composeWithDevTools } from "@redux-devtools/extension";
// import reducer from "./reducer/index";
// import thunk from "redux-thunk";
// import { Provider } from "react-redux";

// const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

export default function MetahkgWebApp() {
    return (
        // <Provider store={store}>
        <ContextProvider>
            <MenuProvider>
                <App />
            </MenuProvider>
        </ContextProvider>
        // </Provider>
    );
}
