import "./App.css";
import { createContext, useEffect, useState } from "react";
import { getAirtableData } from "./services/airtableService";
import Header from "./components/Header";
import bg1 from "./assets/bg1.svg";
import bg2 from "./assets/bg2.svg";
import ButtonGroup from "./components/shared/ButtonGroup";
import Section from "./components/Section";

export const DataContext = createContext(null);

function App() {
  const [data, setData] = useState(null);
  const [sections, setSections] = useState(null);
  const [topic, setTopic] = useState(null);
 

  useEffect(() => {
    getAirtableData("configuration_2022").then((data) => {
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
    return <>Loading</>;
  }
}

export default App;
