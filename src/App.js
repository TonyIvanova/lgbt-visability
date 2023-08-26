import "./App.css";
import Map from "./components/Map";
import { createContext, useEffect, useState } from "react";
import { getAirtableData } from "./services/airtableService";
import mapData from "./assets/geodata/mapData.json";
import Header from "./components/Header";
import bg1 from "./assets/bg1.svg";
import bg2 from "./assets/bg2.svg";

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
      <Header />
      <DataContext.Provider value={data}>
        <Map mapData={mapData} />
        <img src={bg1} alt="" className="background-image-1"></img>
        <img src={bg2} alt="" className="background-image-2"></img>
      </DataContext.Provider>
    </div>
  );
}

export default App;
