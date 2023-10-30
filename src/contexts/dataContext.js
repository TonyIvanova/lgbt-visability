// dataContex.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchDataMap } from '../services/googleSheetsService';

// Create a DataContext
export const DataContext = createContext();

// Provider component
export const DataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [dataMap, setDataMap] = useState({}); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  // Fetches the data map when when the app or a part of the app using the provider first mounts
  useEffect(() => {
    async function loadMap() {
      try {
          const map = await fetchDataMap();
          setDataMap(map);
          setLoading(false);
      } catch (err) {
          setError(err);
          setLoading(false);
      }
  }
    loadMap();
  }, []);

  return (
    <DataContext.Provider value={{ 
      data, setData, 
      dataMap, setDataMap, 
      loading, error 
      }}>
      {children}
    </DataContext.Provider>
  );
};

// Hook that shorthands the use of Data
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
export const useDataMap = () => {
  const { dataMap, setDataMap } = useContext(DataContext);
  if (dataMap === undefined) {
    throw new Error('useDataMap must be used within a DataProvider');
  }
  return { dataMap, setDataMap };
};