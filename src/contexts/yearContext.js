import React, { createContext, useContext, useState } from "react";

// Create a Context
export const YearContext = createContext();
// console.log('YearContext start')
// Create a Provider component
export const YearProvider = ({ children }) => {
  // console.log('YearProvider start')
  const [year, setYear] = useState("2022");
  return (
    <YearContext.Provider value={{ year, setYear }}>
      {children}
    </YearContext.Provider>
  );
};

// Hhook that shorthands the use of context
export const useYear = () => {
 // console.log('useYear start')
  const context = useContext(YearContext);
  if (!context) {
    throw new Error("useYear must be used within a YearProvider");
  }
  return context;
};
