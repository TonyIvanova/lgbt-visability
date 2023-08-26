import React, { useContext } from "react";
import { DataContext } from "../App";
import PieChart from "./shared/PieChart";
import Map from "./shared/Map";
import mapData from "./../assets/geodata/mapData.json";
import PersonalStories from "./shared/PersonalStories";

export default function Section({ name, conclusions }) {
  const data = useContext(DataContext);

  return (
    <div>
      <h2>{name}</h2>
      <div className="section">
        <Map mapData={mapData} />
        <PieChart data={pieChartData} />
      </div>
      <div className="conclusions">
        <h2>Выводы</h2>
        {conclusions.map((item, index) => {
          return <p key={index}>{item.text}</p>;
        })}
      </div>
      <div>
        <PersonalStories stories={personalStories} />
      </div>
    </div>
  );
}

export const pieChartData = [
  { name: "Зарабатывают много", value: 90 },
  { name: "мало", value: 12 },
  { name: "средне", value: 34 },
];


const personalStories = [
  {
    message:
      "«В прошлом я потеряла работу из-за аутинга на рабочем месте. Теперь я заранее не рассматриваю многие вакансии, которые мне были бы интересны».",
    signature: "Бисексуальная цисгендерная женщина, 33 года, Санкт-Петербург",
  },
  {
    message:
      "«Из-за указания неактуальных мужских ФИО в справке о несудимости работодатели отказываются брать меня на работу, но напрямую об этом не говорят, находя другие причины отказа в трудоустройстве».",
    signature:
      "Бисексуальная небинарная трансгендерная женщина, 29 лет, Татарстан",
  },
  {
    message: "«Запретили работать с детьми. Уволили под давлением».",
    signature: "Гомосексуальная цисгендерная женщина, 29 лет, Санкт-Петербург",
  },
  {
    message:
      "«Я не могу устроиться на официальную работу из-за трансгендерности, а при устройстве на неофициальную я умалчиваю о своей гендерной идентичности».",
    signature:
      "Бисексуальный трансгендерный мужчина, 21 год, Ставропольский край",
  },
];