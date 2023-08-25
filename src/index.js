import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./fonts/helveticaneuecyr-heavy.woff2";
import "./fonts/Stolzl-Medium.woff2";
import "./fonts/Stolzl-Regular.woff2";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
