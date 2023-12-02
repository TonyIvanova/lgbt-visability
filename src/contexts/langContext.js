// dataContex.js

import React, { createContext, useContext, useState } from 'react';

// Create a context for the language
export const LanguageContext = createContext();
// console.log('LanguageContext start');
// Create a provider component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('ru');
  // console.log('LanguageProvider start');
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using the language context
// export const useLanguage = () => {
//   console.log('useLang start')
//   return useContext(LanguageContext);
// };

export const useLanguage = () => {
  const { language, setLanguage } = useContext(LanguageContext);
  if (language === undefined) {
    throw new Error('useLanguage must be used within a DataProvider');
  }
  return { language, setLanguage };
};
