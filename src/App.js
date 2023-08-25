import "./App.css";
import Test from "./components/Test";
import { createContext, useEffect, useState } from "react";
import { getAirtableData } from "./services/airtableService";

export const DataContext = createContext(null);

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getAirtableData("LGBT Data").then((data) => {
      setData(data);
    });
  }, []);

  return (
    <div className="App">
      <DataContext.Provider value={data}>
        <Test />
      </DataContext.Provider>
    </div>
  );
}

export default App;
