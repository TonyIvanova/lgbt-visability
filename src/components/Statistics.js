import React, { useState, useEffect } from "react";
import Map from "./shared/Map";
import PieChart from "./shared/PieChart";
import { getAirtableData } from ".././services/airtableService";

export default function Statistics({ topic }) {
  const [chartData, setChartData] = useState([]);
  const [mapData, setMapData] = useState([]);
  const [chartDescription, setChartDescription] = useState("");
  const [mapDescription, setMapDescription] = useState("");

  useEffect(() => {
    getAirtableData(topic).then((res) => {
      setChartData(parseChartData(res));
      setMapData(parseMapData(res));
    });

    getAirtableData("descriptions").then((res) => {
      setDescriptions(res);
    });
  }, [topic]);

  const setDescriptions = (res) => {
    const relevantTopic = res.find((value) => value.Name === topic);
    setChartDescription(relevantTopic?.Pie);
    setMapDescription(relevantTopic?.Map);
  };

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
        <div>
          <Map statistics={mapData} />
          <p className="statistics-description"> {mapDescription}</p>
        </div>
        <div>
          <PieChart data={chartData} />
          <p className="statistics-description">{chartDescription}</p>
        </div>
      </div>
    );
  }
}
