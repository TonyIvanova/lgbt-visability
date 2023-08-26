import React from "react";

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
