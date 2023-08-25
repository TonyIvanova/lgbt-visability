import React, { useContext } from "react";
import { DataContext } from "../App";

export default function Test() {
  const data = useContext(DataContext);
  return (
    <div className="page">
      <h3>Airtable data</h3>
      {JSON.stringify(data)}
    </div>
  );
}
