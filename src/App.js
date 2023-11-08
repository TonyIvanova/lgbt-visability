// App.js

import "./App.css";
import { createContext, useEffect, useState } from "react";
import { 
  getSections, 
  getSheetData, 
  dataMap,
  loadYearData,
  loadConfig
 } from "./services/googleSheetsService";
import Header from "./components/Header";
import bg1 from "./assets/bg1.svg";
import bg2 from "./assets/bg2.svg";
import loader from "./assets/loader.gif";
import { ButtonGroup1, ButtonGroup2 } from "./components/shared/ButtonGroup";
import { LinkComponent } from './components/shared/LinkComponent';
import {
  DataProvider,
  useData,
  useDataMap,
  useConfiguration,
  useDescriptions,
  useSubset
} from "./contexts/dataContext";
import { LanguageProvider, useLanguage } from './contexts/langContext';
import Section from "./components/Section";
import { useYear, YearProvider } from "./contexts/yearContext";

export const DataContext = createContext([]);

function AppContent() {
  console.log('AppContent start')
  const CONFIG_SHEET_ID = '1QKmA5UX-FM31jEE7UOVTmlCKxQ_Wa1K2oXxulhtkJHE'
  const [sections, setSections] = useState(null);
  const [topic, setTopic] = useState(null);
  const { language, setLanguage } = useLanguage();
  const { year, setYear } = useYear(); // report year
  // const { dataMap, setDataMap } = useDataMap(); // reports ids
  const { data, setData } = useData();
  const configuration = useConfiguration()
  const descriptions = useDescriptions()
  const [whichSubset, setWhichSubset] = useState('All'); //Trans/Cis

  const [opennessGroup, setOpennessGroup] = useState('')

  const [yearData, setYearData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const years = Object.keys(dataMap);// to get list of years reports exist for



  // Get selected year
  const selectYear = (event) => {
    setYear(event.target.name);
  };

  // Load year data 
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await loadYearData(year);
        setYearData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [year]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Get sections names: from config.xlsx
  useEffect(() => {
    getSections('ru').then((data) => {
      setSections(data.map((row) => row.name));
      setTopic(data[0].name);
    })
  }, [language, configuration]);  // Re-fetch translations when the language changes

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  const selectTopic = (event) => {
    console.log(event.target.name);
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
          doSomethingAfterClick={selectYear}
        />

        <LinkComponent
          href="https://file.notion.so/f/s/3f63cada-c12a-4eca-99a6-b84e522f7e23/%D0%94%D0%BE%D0%BA%D0%BB%D0%B0%D0%B4_%D0%BE_%D0%BF%D0%BE%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B8_%D0%9B%D0%93%D0%91%D0%A2_%D0%BB%D1%8E%D0%B4%D0%B5%D0%B9_%D0%B2_%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D0%B8_%D0%B2_2022_%D0%B3%D0%BE%D0%B4%D1%83_FIN_RUS.pdf?id=2bdf16e6-9614-4150-b857-e482f92fa0fb&table=block&spaceId=6398057c-62de-418f-af30-b4892f72994d&expirationTimestamp=1698199200000&signature=hiCTwxpZilClgplfjpd1bLQR3dViGuFGuFAzRgmdISE&downloadName=%D0%94%D0%BE%D0%BA%D0%BB%D0%B0%D0%B4_%D0%BE_%D0%BF%D0%BE%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B8_%D0%9B%D0%93%D0%91%D0%A2_%D0%BB%D1%8E%D0%B4%D0%B5%D0%B9_%D0%B2_%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D0%B8_%D0%B2_2022_%D0%B3%D0%BE%D0%B4%D1%83_FIN_RUS.pdf"
          label={`Ссылка на полную версию отчета за ${year} год`}
          color="grey"
        />

        <h1>
          {language === 'ru'
            ? `Положение лгбт+ людей в россии на ${year} год`
            : `LGBT+ people's situation in Russia in ${year}`}
        </h1>

        <ButtonGroup1
          buttons={sections}
          doSomethingAfterClick={selectTopic}
        />

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

        <h1>
          {language === 'ru'
            ? `Положение лгбт+ людей в россии на ${year} год`
            : `LGBT+ people's situation in Russia in ${year}`}
        </h1>


        <img src={loader} alt=""></img>
        <img src={bg1} alt="" className="background-image-1"></img>
        <img src={bg2} alt="" className="background-image-2"></img>
      </div>
    );
  }
}


function App() {
  console.log('App start');

  return (
    <LanguageProvider>
      <YearProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </YearProvider>
    </LanguageProvider>
  );
}


export default App;
