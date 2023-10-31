import React, { useState, useEffect } from "react";
import PersonalStories from "./shared/PersonalStories";
import { getSheetData, fetchDataMap } from "../services/googleSheetsService";
import Statistics from "./Statistics";
import {
  useDataMap,
  useDatata,
  useWhichSubset
} from "../contexts/dataContext"
import { useYear, YearProvider } from "../contexts/yearContext";


export default function Section({ topic }) {
  const [conclusions, setConclusions] = useState([]);
  const {year, setYear} = useYear();
  const {dataMap} = useDataMap()


  useEffect(() => {

    getSheetData('16rkG1h_82MCuImvFkvV8P7N5TsJw5S49avmCuUG3HQ', 'conclusions').then((data) => {
      setConclusions(data.filter((row) => row.name === topic));
    });
  }, [topic, year]);

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
