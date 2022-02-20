import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

// 🌎 Importing styles for Stellar Design System
import "@stellar/design-system/build/styles.min.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
