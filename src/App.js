import "./App.css";
import { createContext, useEffect, useState } from "react";
import { getSheetData, dataMap } from "./services/googleSheetsService";
import Header from "./components/Header";
import bg1 from "./assets/bg1.svg";
import bg2 from "./assets/bg2.svg";
import loader from "./assets/loader.gif";
import ButtonGroup from "./components/shared/ButtonGroup";
import Section from "./components/Section";

export const DataContext = createContext(null);

function App() {
  const [sections, setSections] = useState(null);
  const [topic, setTopic] = useState(null);

  useEffect(() => {
    getSheetData(dataMap['2022']['report']['sheet'], 'configuration').then((data) => {
      setSections(data.map((row) => row.section_title));
      setTopic(data[0].section_title);
    });
  }, []);

  const selectTopic = (event) => {
    setTopic(event.target.name);
  };

  const topicComponent = () => {
    return (
      <>
        <Section topic={topic} />
      </>
    );
  };

  if (sections) {
    return (
      <div className="App">
        <Header />

        <h1>Положение лгбт+ людей в россии на 2022 год</h1>
        <ButtonGroup buttons={sections} doSomethingAfterClick={selectTopic} />
        <div className="topic-component">{topicComponent()}</div>
        {/* <DataContext.Provider value={{ data, conclusions }}> */}
        <img src={bg1} alt="" className="background-image-1"></img>
        <img src={bg2} alt="" className="background-image-2"></img>
        {/* </DataContext.Provider> */}
      </div>
    );
  } else {
    return (
      <div className="App">
        <Header />
        <h1>Положение лгбт+ людей в россии на 2022 год</h1>
        <img src={loader} alt=""></img>
        <img src={bg1} alt="" className="background-image-1"></img>
        <img src={bg2} alt="" className="background-image-2"></img>
      </div>
    );
  }
}

export default App;
