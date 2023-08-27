import React, { useState, useEffect } from "react";
import PersonalStories from "./shared/PersonalStories";
import { getAirtableData } from ".././services/airtableService";
import Statistics from "./Statistics";

export default function Section({ topic }) {
  const [conclusions, setConclusions] = useState([]);

  useEffect(() => {
    getAirtableData("conclusions_2022").then((data) => {
      setConclusions(data.filter((row) => row.name === topic));
    });
  }, [topic]);

  return (
    <div>
      <h2 style={{color:'#969aff'}}>{topic}</h2>
      <Statistics topic={topic} />
      <div className="conclusions">
        <h2 style={{color:'#969aff'}}>Выводы</h2>
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
