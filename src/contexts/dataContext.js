// dataContex.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  dataMap,
  makeTopicsMap,
  
  // getConfiguration,
  // getDescriptions,
} from '../services/googleSheetsService';
import { useYear } from './yearContext';
import { useLanguage } from './langContext'

// Create a DataContext
export const DataContext = createContext();

// Provider component
export const DataProvider = ({ children }) => {
  // console.log('DataProvider start')

  const { year } = useYear()
  const { language } = useLanguage()

  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [descriptions, setDescriptions] = useState({});
  const [configuration, setConfiguration] = useState({});
  const [genderSubset, setGenderSubset] = useState('all'); //Trans/Cis

  const [topicsMap, setTopicsMap] = useState({});
  useEffect(() => {
    makeTopicsMap().then(map => {
      setTopicsMap(map);
      setLoading(false);
    }).catch(err => {
      setError(err);
      setLoading(false);
    });
  }, []);
  

  return (
    <DataContext.Provider value={{
      topicsMap,
      // data, setData,
      // dataMap,
      loading, error,
      // descriptions,
      // configuration,
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

export const useTopicsMap= () => {
  return useContext(DataContext);
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