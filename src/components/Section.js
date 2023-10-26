import React, { useState, useEffect } from "react";
import PersonalStories from "./shared/PersonalStories";
import { getSheetData, dataMap } from ".././services/googleSheetsService";
import Statistics from "./Statistics";

export default function Section({ topic }) {
  const [conclusions, setConclusions] = useState([]);

  useEffect(() => {
    getSheetData(dataMap['2022']['report']['sheet'], 'conclusions').then((data) => {
      setConclusions(data.filter((row) => row.name === topic));
    });
  }, [topic]);

  return (
    <div>
      <Statistics topic={topic} />
      <div className="conclusions">
        <h2>Выводы</h2>
        {conclusions.map((item, index) => {
          return <p key={index}>{item.text}</p>;
        })}
      </div>
      <div>
        <PersonalStories topic={topic} />
      </div>
    </div>
  );
}
