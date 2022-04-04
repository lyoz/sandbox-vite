import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import AppOld from "./AppOld";

ReactDOM.render(
  <React.StrictMode>
    <App />
    <AppOld />
  </React.StrictMode>,
  document.getElementById("root")
);
