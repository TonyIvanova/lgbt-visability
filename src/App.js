import "./App.css";
import Map from "./components/Map";
import { createContext, useEffect, useState } from "react";
import { getAirtableData } from "./services/airtableService";
import mapData from "./assets/geodata/mapData.json";

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
        <Map mapData={mapData} />
      </DataContext.Provider>
    </div>
  );
}

export default App;
