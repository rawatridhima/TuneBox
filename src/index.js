import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import { PersistGate } from "redux-persist/integration/react";
import persistStore from "redux-persist/es/persistStore";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <BrowserRouter>
      <Provider store={store}>
      <PersistGate persistor={persistStore(store)} loading={null}>
        <App />
        </PersistGate>
      </Provider>
    </BrowserRouter>
);
