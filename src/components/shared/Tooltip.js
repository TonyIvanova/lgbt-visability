import React from "react";
<<<<<<< HEAD
=======
// import {useYear } from "./contexts/yearContext";
>>>>>>> e96e25f (init)

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
