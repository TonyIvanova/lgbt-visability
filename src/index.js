import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import axios from "axios";
import Airtable from "airtable";

//create a new Airtable object in React
new Airtable({ apiKey: "API_KEY" }).base("BASE_ID");
//base endpoint to call with each request
axios.defaults.baseURL = "https://api.airtable.com/v0/appOzHt3RKybzSlOM/map/";

//airtable.com/appOzHt3RKybzSlOM/shrATbjWZHUVQmhr5
//content type to send with all POST requests
https: axios.defaults.headers.post["Content-Type"] = "application/json";
//authenticate to the base with the API key
axios.defaults.headers["Authorization"] = process.env.AIRTABLE_API_KEY;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
