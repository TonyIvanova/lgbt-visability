import React, { useState, useEffect } from "react";
import Map from "./shared/Map";
import PieChart from "./shared/PieChart";
import { getAirtableData } from ".././services/airtableService";

export default function Statistics({ topic }) {
  const [chartData, setChartData] = useState([]);
  const [mapData, setMapData] = useState([]);

  useEffect(() => {
    getAirtableData(topic).then((res) => {
      setChartData(parseChartData(res));
      setMapData(parseMapData(res));
    });
  }, [topic]);

  const parseChartData = (res) => {
    if (res?.length === 0) return [];
    const fields = Object.keys(res[0])
      .filter((key) => key !== "District" && key !== "All")
      .map((key) => {
        return key;
      });

    const values = res.find((row) => row.District === "Все");
    const result = fields.map((field) => {
      return { name: field, value: values[field] };
    });
    return result;
  };

  const parseMapData = (res) => {
    const result = res.map((row) => {
      return {
        name: row.District,
        value: row.All,
      };
    });
    return result;
  };

  if (chartData) {
    return (
      <div className="section">
        <Map statistics={mapData} />
        <PieChart data={chartData} />
      </div>
    );
  }
}
