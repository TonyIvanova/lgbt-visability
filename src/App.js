import "./App.css";
import { createContext, useEffect, useState } from "react";
import { getData, getSheetData } from "./services/googleService";
import Header from "./components/Header";
import bg1 from "./assets/bg1.svg";
import bg2 from "./assets/bg2.svg";
import loader from "./assets/loader.gif";
import ButtonGroup from "./components/shared/ButtonGroup";
import Section from "./components/Section";
import { YearProvider, useYear } from "./contexts/yearContext";
import { DataProvider } from "./contexts/dataContext";


export const DataContext = createContext(null);

function App() {
  const [sections, setSections] = useState(null);
  const [topic, setTopic] = useState(null);
  const { year, setYear } = useYear();

  //This hook retrieves data when the component is mounted or year changed
  useEffect(() => {
    getData(year).then(yearData => {
      // Get data from 'configuration' sheet
      configurationData = getSheetData('configuration')
      
      if (configurationData) {
        //Set menu buttons sections
        setSections(configurationData.map((row) => row.section_title));
        setTopic(configurationData[0].section_title);
        console.log(configurationData)

      } else {
        console.error("No configuration data found for year:", year);
      }

    }).catch(error => {

      console.error("Error fetching data for year:", year, error);
    });
  }, [year]);

  //// Function to update the topic state based on the name of the clicked button
  const selectTopic = (event) => {
    setTopic(event.target.name);
  };

  // Function to return the Section component with the topic as a prop
  const topicComponent = () => {
    return (
      <>
        <Section topic={topic} />
      </>
    );
  };

  // Function to update the year state
  const selectYear = (event) => {
    setYear(event.target.name);
  };

  // Conditionally render the app’s UI based on whether section data is available.
  if (sections) {
    return (

      <YearProvider>
        <DataProvider>
          <div className="App">
            <Header />

            <ButtonGroup
              buttons={["2022", "2023"]}
              doSomethingAfterClick={selectYear}
            />

            {/* TODO: change data based on year picked */}

            <h1>Положение лгбт+ людей в россии на ${year} год</h1>
            <ButtonGroup buttons={sections} doSomethingAfterClick={selectTopic} />
            <div className="topic-component">{topicComponent()}</div>
            {/* <DataContext.Provider value={{ data, conclusions }}> */}
            <img src={bg1} alt="" className="background-image-1"></img>
            <img src={bg2} alt="" className="background-image-2"></img>
            {/* </DataContext.Provider> */}
          </div>
        </DataProvider>
      </YearProvider>
   
    );
  } else {
    return (
      <YearProvider>
        <DataProvider>
          <div className="App">
            <Header />
            <h1>Положение лгбт+ людей в россии на 2022 год</h1>
            <img src={loader} alt=""></img>
            <img src={bg1} alt="" className="background-image-1"></img>
            <img src={bg2} alt="" className="background-image-2"></img>
          </div>
        </DataProvider>
      </YearProvider>

    );



  }
}



export default App;
