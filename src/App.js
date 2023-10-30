// App.js

import "./App.css";
import { createContext, useEffect, useState } from "react";
import { getSheetData, fetchDataMap } from "./services/googleSheetsService";
import Header from "./components/Header";
import bg1 from "./assets/bg1.svg";
import bg2 from "./assets/bg2.svg";
import loader from "./assets/loader.gif";
import {ButtonGroup1,ButtonGroup2} from "./components/shared/ButtonGroup";
import {LinkComponent} from './components/shared/LinkComponent';
import { DataProvider, useData, useDataMap } from "./contexts/dataContext";
import Section from "./components/Section";
import { useYear, YearProvider } from "./contexts/yearContext";

export const DataContext = createContext(null);

function AppContent() {
  const [sections, setSections] = useState(null);
  const [topic, setTopic] = useState(null);
  const {year, setYear} = useYear();
  const { dataMap, setDataMap } = useDataMap(); 
  const { data, setData } = useData(); 


  const [years, setYears] = useState([]);
  // Fetch years when component mounts
  useEffect(() => {
    async function fetchYears() {
      const map = await fetchDataMap(); 
      const fetchedYears = Object.keys(map); // an array of years
      setYears(fetchedYears);
    }
    fetchYears();
  }, []);

  const selectYear = (event) => {
    setYear(event.target.name);
  };

  useEffect(() => {
    // TODO: change to config/configuration/key+lang
    getSheetData(dataMap[year]['report']['sheet'], 'configuration').then((data) => {
      setSections(data.map((row) => row.section_title));
      setTopic(data[0].section_title);
    });
  }, [year]);

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
        <ButtonGroup2
              buttons={years}//{["2022", "2023"]}
              // TODO: fetch years from config/years_data/year
              doSomethingAfterClick={selectYear}              
            />

        <LinkComponent 
          href="https://file.notion.so/f/s/3f63cada-c12a-4eca-99a6-b84e522f7e23/%D0%94%D0%BE%D0%BA%D0%BB%D0%B0%D0%B4_%D0%BE_%D0%BF%D0%BE%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B8_%D0%9B%D0%93%D0%91%D0%A2_%D0%BB%D1%8E%D0%B4%D0%B5%D0%B9_%D0%B2_%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D0%B8_%D0%B2_2022_%D0%B3%D0%BE%D0%B4%D1%83_FIN_RUS.pdf?id=2bdf16e6-9614-4150-b857-e482f92fa0fb&table=block&spaceId=6398057c-62de-418f-af30-b4892f72994d&expirationTimestamp=1698199200000&signature=hiCTwxpZilClgplfjpd1bLQR3dViGuFGuFAzRgmdISE&downloadName=%D0%94%D0%BE%D0%BA%D0%BB%D0%B0%D0%B4_%D0%BE_%D0%BF%D0%BE%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B8_%D0%9B%D0%93%D0%91%D0%A2_%D0%BB%D1%8E%D0%B4%D0%B5%D0%B9_%D0%B2_%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D0%B8_%D0%B2_2022_%D0%B3%D0%BE%D0%B4%D1%83_FIN_RUS.pdf" 
          label={`Ссылка на полную версию отчета за ${year} год`} 
          color="grey" 
          />
        
        <h1>Положение лгбт+ людей в россии на {year} год</h1>

        <ButtonGroup1 buttons={sections} doSomethingAfterClick={selectTopic} />
       
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
        <h1>Положение лгбт+ людей в россии на {year} год</h1>
        <img src={loader} alt=""></img>
        <img src={bg1} alt="" className="background-image-1"></img>
        <img src={bg2} alt="" className="background-image-2"></img>
      </div>
    );
  }
}


function App() {
  return (
    <YearProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </YearProvider>
  );
}


export default App;
