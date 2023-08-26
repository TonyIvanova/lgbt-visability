import "./App.css";
import Map from "./components/Map";
import { createContext, useEffect, useState } from "react";
import { getAirtableData } from "./services/airtableService";
import mapData from "./assets/geodata/mapData.json";
import Header from "./components/Header";
import bg1 from "./assets/bg1.svg";
import bg2 from "./assets/bg2.svg";
import PieChart from "./components/PieChart";
import ButtonGroup from "./components/ButtonGroup";

export const DataContext = createContext(null);

function App() {
  const [data, setData] = useState(null);
  const [topic, setTopic] = useState(null);

  useEffect(() => {
    getAirtableData("LGBT Data").then((data) => {
      setData(data);
    });
  }, []);

  const selectTopic = (event) => {
    setTopic(event.target.name);
    console.info(topic);
  };

  return (
    <div className="App">
      <Header />
      <ButtonGroup
        buttons={[
          "Экономическое положение",
          "Насилие",
          "Взаимодействие с правоохранительными органами",
          "Влияние войны в Украине",
        ]}
        doSomethingAfterClick={selectTopic}
      />
      <DataContext.Provider value={data}>
        <Map mapData={mapData} />
        <PieChart data={donutData} />
        <img src={bg1} alt="" className="background-image-1"></img>
        <img src={bg2} alt="" className="background-image-2"></img>
      </DataContext.Provider>
    </div>
  );
}

export default App;

const donutData = [
  { name: "<5", value: 19 },
  { name: "5-9", value: 200 },
  { name: "10-14", value: 19 },
  { name: "15-19", value: 24 },
];
