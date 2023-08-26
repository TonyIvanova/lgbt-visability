import "./App.css";
import Map from "./components/shared/Map";
import { createContext, useEffect, useState } from "react";
import { getAirtableData } from "./services/airtableService";
import mapData from "./assets/geodata/mapData.json";
import Header from "./components/Header";
import bg1 from "./assets/bg1.svg";
import bg2 from "./assets/bg2.svg";
import PieChart from "./components/shared/PieChart";
import ButtonGroup from "./components/shared/ButtonGroup";
import Section from "./components/Section";

export const DataContext = createContext(null);

function App() {
  const [data, setData] = useState(null);
  const [topic, setTopic] = useState(sections[0]);

  useEffect(() => {
    getAirtableData("LGBT Data").then((data) => {
      setData(data);
    });
  }, []);

  const selectTopic = (event) => {
    setTopic(event.target.name);
    console.info(topic);
  };

  const topicComponent = () => {
    return (
      <>
        <Section name={topic} />
      </>
    );
  };

  return (
    <div className="App">
      <Header />

      <h1>Положение лгбт+ людей в россии на 2022 год</h1>
      <ButtonGroup buttons={sections} doSomethingAfterClick={selectTopic} />
      <div className="topic-component">{topicComponent()}</div>
      <DataContext.Provider value={data}>
        <img src={bg1} alt="" className="background-image-1"></img>
        <img src={bg2} alt="" className="background-image-2"></img>
      </DataContext.Provider>
    </div>
  );
}

export default App;

const sections = [
  "Экономическое положение",
  "Насилие",
  "Взаимодействие с правоохранительными органами",
  "Влияние войны в Украине",
]; 