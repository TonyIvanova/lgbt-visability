import React, { useMemo, useState } from "react";
import * as d3 from "d3";
import * as d3geo from "d3-geo";
import mapData from "./../../assets/geodata/mapData.json";

function Map({ statistics }) {

  console.log('Statistics in Map component:', statistics);
  // Map
  const [regionDescription, setRegionDescription] = useState("");
  const [regionValue, setRegionValue] = useState("");

  const projection = d3geo
    .geoConicConformal()
    .scale(300)
    .center([54, 44])
    .rotate([-105, 0]);

  const path = d3geo.geoPath().projection(projection);

  const values = statistics.map((item) => item.value);
  const min = Math.min(...values);
  const max = Math.max(...values);

  const getScale = () => {
    return [min, (min + max) / 2, max];
  };

  var colorScale = d3.scaleLinear(getScale(), [
    "#F4F3EE",
    "#969AFF",
    "#242424",
  ]);

  const mapElements = useMemo(() => {
    if (statistics.length > 0) {
      return mapData.features.map((d, index) => {
        const relevantStatistics = statistics.filter(
          (item) => item.name === d.properties.name
        )[0];
        const color = relevantStatistics
          ? colorScale(relevantStatistics?.value)
          : "lightgrey";
        return (
          <path
             key={"map-element-" + index}
              name={d.properties.name}
              d={path(d)}
              fill={color}
              stroke="#0e1724"
              strokeWidth="0.5"
              strokeOpacity="0.5"
              opacity="0.9"
              onMouseEnter={(e) => {
                d3.select(e.target).attr("opacity", 1);
                setRegionDescription(relevantStatistics.name);
                setRegionValue(Math.round(relevantStatistics.value));
              }}
              onMouseOut={(e) => {
                d3.select(e.target).attr("opacity", 0.9);
                setRegionDescription("");
                setRegionValue("");
              }}
            />);
      });
    } else {
      return <>
      <p>No map data.</p>
      </>
    }
  }, [mapData, statistics]);

  // Legend

  if (statistics && regionDescription !== "") {
    return (
      <div style={{ position: "relative" }}>
        <svg className="map">
          <g className="map">{mapElements}</g>
        </svg>
        <div className="map-tooltip">
          <h3>{regionDescription}</h3>
          <h2>{regionValue}%</h2>
        </div>
      </div>
    );
  } else if (statistics) {
    return (
      <>
        <svg className="map">
          <g className="map">{mapElements}</g>
        </svg>
      </>
    );
  }
}

export default Map;
