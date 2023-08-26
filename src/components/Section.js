import React, { useContext } from "react";
import { DataContext } from "../App";
import PieChart from "./shared/PieChart";
import Map from "./shared/Map";
import mapData from "./../assets/geodata/mapData.json";

export default function Section({ name }) {
  const data = useContext(DataContext);

  return (
    <div>
      <h2>{name}</h2>
      <div className="section">
        <Map mapData={mapData} />
        <PieChart data={pieChartData} />
      </div>
    </div>
  );
}

const pieChartData = [
  { name: "<5", value: 19 },
  { name: "5-9", value: 200 },
  { name: "10-14", value: 19 },
  { name: "15-19", value: 24 },
];
