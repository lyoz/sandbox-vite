import React from "react";
import ReactDOM from "react-dom";
import DemoWithReduxSaga from "./DemoWithReduxSaga";
import DemoWithRTKQuery from "./DemoWithRTKQuery";

ReactDOM.render(
  <React.StrictMode>
    <DemoWithReduxSaga />
    <DemoWithRTKQuery />
  </React.StrictMode>,
  document.getElementById("root")
);
