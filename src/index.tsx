import React from "react";
import ReactDOM from "react-dom";
import { Web3ReactProvider } from "@web3-react/core";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { getLibrary } from "utils/web3React";
import { RefreshContextProvider } from "contexts/RefreshContext";
import store from "state";
import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <RefreshContextProvider>
          <ToastContainer />
          <App />
        </RefreshContextProvider>
      </Web3ReactProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
