import React, { useState, useEffect } from "react";
import PersonalStories from "./shared/PersonalStories";
import { getSheetData, fetchDataMap } from "../services/googleSheetsService";
import Statistics from "./Statistics";
import {
  useDataMap,
  useDatata,
  useWhichSubset
} from "../contexts/dataContext"
import {
  useLanguage
} from "../contexts/langContext"
import { useYear, YearProvider } from "../contexts/yearContext";


export default function Section({ topic }) {
  const [conclusions, setConclusions] = useState([]);
  const {year, setYear} = useYear();
  const {dataMap} = useDataMap()
  const {language} = useLanguage()


  useEffect(() => {
    async function fetchConclusions() {
      const conclusions = await getConclusions(dataMap, topic, language);
      setConclusions(conclusions);
      // setConclusionIndex(0);
    }

    async function getConclusions(dataMap, topic, language) {
      const rawData = await getSheetData( dataMap[year]['report']['sheet'],  'conclusions');
      console.log('raw Conclusions', rawData)
      const mappedData = rawData.map(item => ({
        key: item.key,
        name: item[`name_${language}`],
        text: item[`text_${language}`]
      }));
      console.log('mapped conclusions', mappedData)
      return mappedData.filter(story => story.name === topic);

    }

    fetchConclusions();
    console.log('conclusions:::', conclusions)
  }, [topic, language, year, dataMap]);




  // useEffect(() => {

  //   getSheetData('16rkG1h_82MCuImvFkvV8P7N5TsJw5S49avmCuUG3HQ', 'conclusions').then((data) => {
  //     setConclusions(data.filter((row) => row.name === topic));
  //   });
  // }, [topic, year]);

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
