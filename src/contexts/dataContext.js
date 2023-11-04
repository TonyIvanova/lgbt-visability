// dataContex.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getDataMap,
  getConfiguration,
  getDescriptions,
  getFullSpreadsheetData
} from '../services/googleSheetsService';
import { useYear } from './yearContext';
import { useLanguage } from './langContext'

// Create a DataContext
export const DataContext = createContext();

// Provider component
export const DataProvider = ({ children }) => {
  // console.log('DataProvider start')
  const [data, setData] = useState(null);
  const [dataMap, setDataMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [descriptions, setDescriptions] = useState({});
  const [configuration, setConfiguration] = useState({});
  const [whichSubset, setWhichSubset] = useState('All'); //Trans/Cis

  const { year } = useYear()
  const { language } = useLanguage()

  // Fetches the data map when when the app or a part of the app using the provider first mounts
  useEffect(() => {
    async function loadDataMap() {
      // console.log('loadConfig start')
      try {
        const map = await getDataMap();
        setDataMap(map);
        setLoading(false);

      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }
    loadDataMap();
  }, []);

  useEffect(() => {
    async function loadConfig() {
      // console.log('loadConfig start')
      try {

        const descr = await getDescriptions(language);
        // console.log(descriptions);
        setDescriptions(descr)

        const config = await getConfiguration(language);
        setConfiguration(config)
        // console.log(configuration);

      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }
    loadConfig();
  }, [language]);


  const topicsMap = {
    "Экономическое положение": "economical_status",
    "Economical status": "economical_status",
    "Насилие": "violence",
    "Violence": "violence",
    "Дискриминация": "discrimination",
    "Discrimination": "discrimination",
    "Влияние войны в Украине": "war_effects",
    "Effects of war in Ukraine": "war_effects",
    "Открытость": "openness",
    "Openness": "openness",
  };

  // useEffect(() => {
  //   async function loadSpreadsheet() {
  //     console.log('loadSpreadsheet start')
  //     try {        
  //         const data = await getFullSpreadsheetData(year)
  //         console.log(data);
  //         setData(data);
  //     } catch (err) {
  //         setError(err);
  //         setLoading(false);
  //     }
  // }
  // loadSpreadsheet();
  // }, [year]);


  return (
    <DataContext.Provider value={{
      data, setData,
      dataMap,
      loading, error,
      descriptions,
      configuration,
      // whichSubset, setWhichSubset 
    }}>
      {children}
    </DataContext.Provider>
  );
};

// Hook that shorthands the use of Data
export const useData = () => {
  // console.log('useData start')
  // const {data, setData} = useContext(DataContext);
  // if (!data) {
  //   throw new Error('useData must be used within a DataProvider');
  // }
  // return {data, setData};

  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;


};

// export const useSpreadsheet = () => {
//   console.log('useData start')
//   const {data} = useContext(DataContext);
//   if (!data) {
//     throw new Error('useData must be used within a DataProvider');
//   }
//   return data;
// };




export const useDataMap = () => {
  // console.log('useDataMap start')
  const { dataMap, setDataMap } = useContext(DataContext);
  if (dataMap === undefined) {
    throw new Error('useDataMap must be used within a DataProvider');
  }
  return { dataMap, setDataMap };
};

export const useConfiguration = () => {
  const { configuration } = useContext(DataContext);
  if (configuration === undefined) {
    throw new Error('useConfiguration must be used within a DataProvider');
  }
  return configuration;
};

export const useDescriptions = () => {
  const { descriptions } = useContext(DataContext);
  if (descriptions === undefined) {
    throw new Error('useDescriptions must be used within a DataProvider');
  }
  return descriptions;
};

// export const useSubset = () => {
//   const { whichSubset, setWhichSubset } = useContext(DataContext);
//   if (whichSubset === undefined) {
//     throw new Error('usewhichSubset must be used within a DataProvider');
//   }
//   return  { whichSubset, setWhichSubset } ;
// };