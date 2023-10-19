import React from "react";

// import {useYear } from "./contexts/yearContext";


export default function Tooltip({ show, text }) {
  const visibility = {
    visibility: show ? "visible" : "hidden",
  };
  return (
    <div className="tooltip" style={visibility}>
      {text}
    </div>
  );
}
