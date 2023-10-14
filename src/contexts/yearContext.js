import React, { createContext, useContext, useState } from "react";

// Create a Context
export const YearContext = createContext();

// Create a Provider component
export const YearProvider = ({ children }) => {
  const [year, setYear] = useState("2022");
  return (
    <YearContext.Provider value={{ year, setYear }}>
      {children}
    </YearContext.Provider>
  );
};

// Custom hook that shorthands the use of context
export const useYear = () => {
  const context = useContext(YearContext);
  if (!context) {
    throw new Error("useYear must be used within a YearProvider");
  }
  return context;
};
