// App.js

import "./App.css";
import { createContext, useEffect, useState } from "react";
import { getSheetData, fetchDataMap } from "./services/googleSheetsService";
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
// import useSpreadsheetData from './services/googleSheetsApi'
import {
  getSpreadsheetData,
  getSheetIdByYear,
  getDescriptions,
  getConfiguration,
  // getSheetData,
  createTopicsMap,
  getSections,
  getYears
} from './services/googleSheetsApi'

export const DataContext = createContext([]);
// import axios from 'axios';


function AppContent() {
  const { language, setLanguage } = useLanguage();
  const { year, setYear } = useYear(); // report year


  const [configData, setConfigData] = useState(null);
  const [years, setYears] = useState(null);
  const [topicsMap, setTopicsMap] = useState(null);
  const [configuration, setConfiguration] = useState(null);
  const API_KEY = process.env.REACT_APP_API_KEY;
  const CONFIG_SPREADSHEET_ID = process.env.REACT_APP_CONFIG_SPREADSHEET_ID;

  //Load CONFIG spreadsheet
  useEffect(() => {
    const fetchConfigData = async () => {
      try {
        setConfigData(await getSpreadsheetData(CONFIG_SPREADSHEET_ID, API_KEY));
      
      } catch (err) {
        setError(err);
      }
    };
    fetchConfigData();
  }, [API_KEY]);

//Update what static variable that depend on COMNIG spreadsheet
  useEffect(() => {
    setConfiguration( getConfiguration(configData))
    setTopicsMap( createTopicsMap(configData))
    setYears( getYears(configData))
  }, 
    [configData])

  //
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);
  
  // Load year REPORT data when CONFIG and year is changed
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const REPORT_SPREADSHEET_ID = getSheetIdByYear(configData, year);
        setReportData(await getSpreadsheetData(REPORT_SPREADSHEET_ID, API_KEY))
      } catch (err) {
        setError(err);
      }
    };
    fetchReportData();
  }, [year, configData]);



  const [descriptions, setDescriptions] = useState(null);
  const [sections, setSections] = useState(null);
  const [topic, setTopic] = useState(null);
  // Update sections, topic, descriptions if language changes
  useEffect(() => {
    setDescriptions( getDescriptions(configData, language))
    setSections(getSections(configData, language))
    setTopic(sections.length > 0 ? sections[0] : null) //default is the first topic
  }, [language, configData])

  const [whichSubset, setWhichSubset] = useState('All'); //Trans/Cis default data subsets
  const [opennessGroup, setOpennessGroup] = useState('Family'); // Opennes default subset

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  if (!configData || !reportData) {
    return <div>Loading...</div>;
  }


  // Get selected year
  const selectYear = (event) => {
    setYear(event.target.name);
  };

// Get selected topic
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

        <div>
          <h1>Spreadsheet Data</h1>
          {/* Convert the spreadsheet data to a string and display it */}
          <pre>{JSON.stringify(configData, null, 2)}</pre> {/* The 'pre' tag is used to preserve whitespace and formatting */}
        </div>

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
